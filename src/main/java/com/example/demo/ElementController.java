package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;
import java.util.Optional;
import java.util.Arrays;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/elements")
public class ElementController {

  private final ElementRepository repository; // Maps to elements table
  private final StudentRepository studentRepository; // Maps to students table
  private final RestClient restClient = RestClient.create();

  // Real UITS endpoint now comes from config (uits.api.url / UITS_API_URL env var).
  // Falls back to the old placeholder if nothing is configured, so local dev
  // still works without extra setup.
  @Value("${uits.api.url:https://typicode.com}")
  private String uitsApiUrl;

  public ElementController(ElementRepository repository, StudentRepository studentRepository) {
    this.repository = repository;
    this.studentRepository = studentRepository;
  }

  // Endpoint 1: Call external API on demand and save to the 'students' table
  @PostMapping("/fetch-external")
  public ResponseEntity<String> fetchAndSaveStudents(
      @RequestParam String startIndex,
      @RequestParam int limitAmount) {

    if (startIndex == null || startIndex.isBlank()) {
      return ResponseEntity.badRequest().body("startIndex is required.");
    }
    if (limitAmount <= 0) {
      return ResponseEntity.badRequest().body("limitAmount must be greater than 0.");
    }

    String schoolApiUrl = UriComponentsBuilder
        .fromUriString(uitsApiUrl)
        .queryParam("start", startIndex)
        .queryParam("limit", limitAmount)
        .toUriString();

    try {
      Student[] externalStudents = restClient.get()
          .uri(schoolApiUrl)
          .retrieve()
          .body(Student[].class);

      if (externalStudents != null && externalStudents.length > 0) {
        studentRepository.saveAll(Arrays.asList(externalStudents));
        return ResponseEntity.ok(
            "Successfully imported " + externalStudents.length + " student records into the registry.");
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
          .body("Failed to fetch from school API: " + e.getMessage());
    }

    return ResponseEntity.ok("No records were found to import.");
  }

  // Endpoint 2: Receive NFC code, compare, and mark checked (smart multipurpose endpoint)
  @PostMapping("/verify-nfc")
  public ResponseEntity<String> handleNfcTraffic(@RequestBody Map<String, Object> payload) {

    // 1. REGISTRATION MODE — fullName present means user filled the popup
    if (payload.containsKey("fullName") && payload.containsKey("indexNumber")) {
      String fullName = asNonBlankString(payload.get("fullName"));
      String indexNumber = asNonBlankString(payload.get("indexNumber"));
      String incomingNfc = asNonBlankString(payload.get("incomingNfc"));

      if (fullName == null) {
        return ResponseEntity.badRequest().body("fullName is required and cannot be blank.");
      }
      if (indexNumber == null) {
        return ResponseEntity.badRequest().body("indexNumber is required and cannot be blank.");
      }
      if (incomingNfc == null) {
        return ResponseEntity.badRequest().body("incomingNfc is required and cannot be blank.");
      }

      Element newElement = new Element();
      newElement.setfullName(fullName);
      newElement.setIndexNumber(indexNumber);
      newElement.setNfcCode(incomingNfc);
      newElement.setChecked(false);
      repository.save(newElement);
      return ResponseEntity.ok("Registration Successful");
    }

    // 2. ATTENDANCE MODE — only uid sent
    if (payload.containsKey("incomingNfc")) {
      String incomingNfc = asNonBlankString(payload.get("incomingNfc"));
      if (incomingNfc == null) {
        return ResponseEntity.badRequest().body("incomingNfc cannot be blank.");
      }

      Optional<Element> found = repository.findByNfcCode(incomingNfc);

      if (found.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NOT_FOUND");
      }

      Element element = found.get();
      element.setChecked(true);
      repository.save(element);
      return ResponseEntity.ok("NFC Verified and Attendance Marked!");
    }

    return ResponseEntity.badRequest().body("Error: Invalid JSON payload structure.");
  }

  // Endpoint 3: Pull full names of all unchecked students
  @GetMapping("/unchecked")
  public ResponseEntity<List<String>> getUncheckedStudentNames() {
    List<Element> uncheckedElements = repository.findByCheckedFalse();

    List<String> names = uncheckedElements.stream()
        .map(element -> studentRepository.findById(element.getIndexNumber())
            .map(Student::getFullName)
            .orElse("Index: " + element.getIndexNumber() + "\n" + " Name: " + element.getfullName() + "\n"))
        .toList();

    return ResponseEntity.ok(names);
  }

  // Endpoint 4: Manual index check-in
  @PostMapping("/{indexNumber}/check-backup")
  public ResponseEntity<String> backupCheck(@PathVariable String indexNumber) {
    if (indexNumber == null || indexNumber.isBlank()) {
      return ResponseEntity.badRequest().body("indexNumber is required.");
    }

    Element attendanceRecord = repository.findById(indexNumber)
        .orElse(new Element());

    attendanceRecord.setIndexNumber(indexNumber);
    attendanceRecord.setChecked(true);
    repository.save(attendanceRecord);

    return ResponseEntity.ok("Manual Backup Success: Attendance marked for index " + indexNumber + "!");
  }

  // Endpoint 5: Clear all external student pulled info from `students` table
  @DeleteMapping("/reset")
  public ResponseEntity<String> emptyTables() {
    studentRepository.deleteAll();
    repository.deleteAll();
    return ResponseEntity.ok("Success: Tables cleared!");
  }

  private String asNonBlankString(Object value) {
    if (!(value instanceof String s)) {
      return null;
    }
    String trimmed = s.trim();
    return trimmed.isEmpty() ? null : trimmed;
  }
}

package com.example.demo;

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

  public ElementController(ElementRepository repository, StudentRepository studentRepository) {
    this.repository = repository;
    this.studentRepository = studentRepository;
  }

  // NOTE: Endpoint 1: Call external API on demand and save to the 'students'
  // table
  @PostMapping("/fetch-external")
  public String fetchAndSaveStudents(
      @RequestParam String startIndex,
      @RequestParam int limitAmount) {

    // FIX: ==========Replace with UITS URL=============
    String schoolApiUrl = UriComponentsBuilder
        .fromUriString("https://typicode.com") // TODO: Placeholder endpoint for UITS URL
        .queryParam("start", startIndex)
        .queryParam("limit", limitAmount)
        .toUriString();

    try {
      // Realigned: Converts JSON to Student array instead of Element array
      Student[] externalStudents = restClient.get()
          .uri(schoolApiUrl)
          .retrieve()
          .body(Student[].class);

      if (externalStudents != null && externalStudents.length > 0) {
        // Realigned: Saves explicitly to the studentRepository (students table)
        studentRepository.saveAll(Arrays.asList(externalStudents));
        return "Successfully imported " + externalStudents.length + " student records into the registry.";
      }
    } catch (Exception e) {
      return "Failed to fetch from school API: " + e.getMessage();
    }

    return "No records were found to import.";
  }

  // NOTE: Endpoint 2: Receive NFC code, compare, and mark checked (smart
  // multipurpose endpoint)
  @PostMapping("/verify-nfc")
  public String handleNfcTraffic(@RequestBody Map<String, Object> payload) {

    // 1. REGISTRATION MODE — fullName present means user filled the popup
    if (payload.containsKey("fullName") && payload.containsKey("indexNumber")) {
      Element newElement = new Element();
      newElement.setfullName((String) payload.get("fullName"));
      newElement.setIndexNumber((String) payload.get("indexNumber"));
      newElement.setNfcCode((String) payload.get("incomingNfc"));
      newElement.setChecked(false);
      repository.save(newElement);
      return "Registration Successful";
    }

    // 2. ATTENDANCE MODE — only uid sent
    if (payload.containsKey("incomingNfc")) {
      String incomingNfc = (String) payload.get("incomingNfc");
      Optional<Element> found = repository.findByNfcCode(incomingNfc);

      // Not found — tell frontend to show the register popup
      if (found.isEmpty()) {
        return "NOT_FOUND";
      }

      // Found — mark attendance
      Element element = found.get();
      element.setChecked(true);
      repository.save(element);
      return "NFC Verified and Attendance Marked!";
    }

    return "Error: Invalid JSON payload structure.";
  }

  // NOTE: Endpoint 3: Pull full names of all unchecked students
  @GetMapping("/unchecked")
  public List<String> getUncheckedStudentNames() {
    // 1. Get all element rows where checked is false
    List<Element> uncheckedElements = repository.findByCheckedFalse();

    // 2. Map those records to their actual full names from the students registry
    return uncheckedElements.stream()
        .map(element -> {
          return studentRepository.findById(element.getIndexNumber())
              .map(Student::getFullName)
              .orElse("Index: " + element.getIndexNumber() + "\n" + " Name: " + element.getfullName() + "\n");
        })
        .toList();
  }

  @PostMapping("/{indexNumber}/check-backup")
  public String backupCheck(@PathVariable String indexNumber) {
    // Look up in elements table directly — no registry check needed for manual
    // override
    Element attendanceRecord = repository.findById(indexNumber)
        .orElse(new Element());

    attendanceRecord.setIndexNumber(indexNumber);
    attendanceRecord.setChecked(true);
    repository.save(attendanceRecord);

    return "Manual Backup Success: Attendance marked for index " + indexNumber + "!";
  }

  // NOTE: Endpoint 5: Clear all external student pulled info from `students`
  // table
  @DeleteMapping("/reset")
  public String emptyTables() {
    studentRepository.deleteAll();
    repository.deleteAll();
    return "Success: Tables cleared!";
  }
}

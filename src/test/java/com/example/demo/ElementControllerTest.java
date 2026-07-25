package com.example.demo;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Covers the attendance-marking flow in ElementController: registering a new
 * card, scanning a known/unknown card, and the manual backup check-in.
 * These were previously untested (only the default contextLoads() stub existed).
 */
@WebMvcTest(ElementController.class)
class ElementControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private ElementRepository elementRepository;

  @MockitoBean
  private StudentRepository studentRepository;

  @Test
  void registeringNewCard_savesElementAndReturnsSuccess() throws Exception {
    mockMvc.perform(post("/api/elements/verify-nfc")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "fullName": "Ama Owusu",
                  "indexNumber": "1001",
                  "incomingNfc": "NFC-ABC-123"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().string("Registration Successful"));
  }

  @Test
  void registeringNewCard_withBlankName_returnsBadRequest() throws Exception {
    mockMvc.perform(post("/api/elements/verify-nfc")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "fullName": "   ",
                  "indexNumber": "1001",
                  "incomingNfc": "NFC-ABC-123"
                }
                """))
        .andExpect(status().isBadRequest());
  }

  @Test
  void scanningKnownCard_marksAttendance() throws Exception {
    Element existing = new Element();
    existing.setIndexNumber("1001");
    existing.setNfcCode("NFC-ABC-123");
    existing.setChecked(false);

    when(elementRepository.findByNfcCode("NFC-ABC-123")).thenReturn(Optional.of(existing));

    mockMvc.perform(post("/api/elements/verify-nfc")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                { "incomingNfc": "NFC-ABC-123" }
                """))
        .andExpect(status().isOk())
        .andExpect(content().string("NFC Verified and Attendance Marked!"));
  }

  @Test
  void scanningUnknownCard_returnsNotFound() throws Exception {
    when(elementRepository.findByNfcCode(any())).thenReturn(Optional.empty());

    mockMvc.perform(post("/api/elements/verify-nfc")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                { "incomingNfc": "UNKNOWN-CARD" }
                """))
        .andExpect(status().isNotFound())
        .andExpect(content().string("NOT_FOUND"));
  }

  @Test
  void getUncheckedStudents_returnsNamesFromRegistry() throws Exception {
    Element unchecked = new Element();
    unchecked.setIndexNumber("1002");
    unchecked.setChecked(false);

    Student student = new Student();
    student.setIndexNumber("1002");
    student.setFullName("Kwame Asare");

    when(elementRepository.findByCheckedFalse()).thenReturn(List.of(unchecked));
    when(studentRepository.findById("1002")).thenReturn(Optional.of(student));

    mockMvc.perform(get("/api/elements/unchecked"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0]").value("Kwame Asare"));
  }

  @Test
  void manualCheckIn_marksExistingRecordChecked() throws Exception {
    mockMvc.perform(post("/api/elements/1003/check-backup"))
        .andExpect(status().isOk())
        .andExpect(content().string("Manual Backup Success: Attendance marked for index 1003!"));
  }
}

package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ElementRepository extends JpaRepository<Element, String> {
  Optional<Element> findByNfcCode(String nfcCode);
  List<Element> findByCheckedFalse();
}

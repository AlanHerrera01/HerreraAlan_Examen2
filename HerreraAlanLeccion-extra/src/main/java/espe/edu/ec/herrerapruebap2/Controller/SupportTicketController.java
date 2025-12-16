package espe.edu.ec.herrerapruebap2.Controller;

import espe.edu.ec.herrerapruebap2.DTO.SupportTicketRequestDTO;
import espe.edu.ec.herrerapruebap2.DTO.SupportTicketResponseDTO;
import espe.edu.ec.herrerapruebap2.Model.Currency;
import espe.edu.ec.herrerapruebap2.Model.Status;
import espe.edu.ec.herrerapruebap2.Services.SupportTicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173", "http://backend:9090", "*"})
@RestController
@RequestMapping("/api/v1/support-tickets")
public class SupportTicketController {
    @Autowired
    private SupportTicketService service;

    @PostMapping
    public ResponseEntity<SupportTicketResponseDTO> createTicket(@Valid @RequestBody SupportTicketRequestDTO dto) {
        SupportTicketResponseDTO created = service.createTicket(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public Page<SupportTicketResponseDTO> getTickets(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Currency currency,
            @RequestParam(required = false) BigDecimal minCost,
            @RequestParam(required = false) BigDecimal maxCost,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort
    ) {
        if (minCost != null && minCost.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("minCost debe ser >= 0");
        if (maxCost != null && maxCost.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("maxCost debe ser >= 0");
        if (from != null && to != null && from.isAfter(to))
            throw new IllegalArgumentException("from debe ser menor o igual a to");
        // Validar campos válidos para sort
        java.util.Set<String> validFields = java.util.Set.of(
            "id", "ticketNumber", "requesterName", "status", "priority", "category", "estimatedCost", "currency", "createdAt", "dueDate"
        );
        Sort sortObj = Sort.by(Sort.Order.desc("createdAt"));
        if (sort != null && sort.length > 0) {
            var orders = java.util.Arrays.stream(sort)
                .map(s -> {
                    String[] parts = s.split(",");
                    String field = parts[0];
                    if (!validFields.contains(field)) return null;
                    if (parts.length == 2 && parts[1].equalsIgnoreCase("asc")) {
                        return Sort.Order.asc(field);
                    } else {
                        return Sort.Order.desc(field);
                    }
                })
                .filter(java.util.Objects::nonNull)
                .toList();
            if (!orders.isEmpty()) {
                sortObj = Sort.by(orders);
            }
        }
        Pageable pageable = PageRequest.of(page, size, sortObj);
        return service.getTickets(q, status, currency, minCost, maxCost, from, to, pageable);
    }
}
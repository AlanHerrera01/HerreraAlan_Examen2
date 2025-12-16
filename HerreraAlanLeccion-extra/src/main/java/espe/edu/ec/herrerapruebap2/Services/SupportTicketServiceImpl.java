package espe.edu.ec.herrerapruebap2.Services;

import espe.edu.ec.herrerapruebap2.DTO.SupportTicketRequestDTO;
import espe.edu.ec.herrerapruebap2.DTO.SupportTicketResponseDTO;
import espe.edu.ec.herrerapruebap2.Model.*;
import espe.edu.ec.herrerapruebap2.Repository.SupportTicketRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SupportTicketServiceImpl implements SupportTicketService {
    @Autowired
    private SupportTicketRepository repository;

    @Override
    public SupportTicketResponseDTO createTicket(SupportTicketRequestDTO dto) {
        SupportTicket ticket = new SupportTicket();
        // Generar ticketNumber único (ejemplo: ST-2025-000001)
        long count = repository.count() + 1;
        String ticketNumber = String.format("ST-%d-%06d", LocalDateTime.now().getYear(), count);
        while (repository.existsByTicketNumber(ticketNumber)) {
            count++;
            ticketNumber = String.format("ST-%d-%06d", LocalDateTime.now().getYear(), count);
        }
        ticket.setTicketNumber(ticketNumber);
        ticket.setRequesterName(dto.getRequesterName());
        ticket.setStatus(dto.getStatus());
        ticket.setPriority(dto.getPriority());
        ticket.setCategory(dto.getCategory());
        ticket.setEstimatedCost(dto.getEstimatedCost());
        ticket.setCurrency(dto.getCurrency());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setDueDate(dto.getDueDate());
        repository.save(ticket);
        return toResponseDTO(ticket);
    }

    @Override
    public Page<SupportTicketResponseDTO> getTickets(String q, Status status, Currency currency, BigDecimal minCost, BigDecimal maxCost, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        Specification<SupportTicket> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("ticketNumber")), pattern),
                    cb.like(cb.lower(root.get("requesterName")), pattern)
                ));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (currency != null) {
                predicates.add(cb.equal(root.get("currency"), currency));
            }
            if (minCost != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("estimatedCost"), minCost));
            }
            if (maxCost != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("estimatedCost"), maxCost));
            }
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return repository.findAll(spec, pageable).map(this::toResponseDTO);
    }

    private SupportTicketResponseDTO toResponseDTO(SupportTicket ticket) {
        SupportTicketResponseDTO dto = new SupportTicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setTicketNumber(ticket.getTicketNumber());
        dto.setRequesterName(ticket.getRequesterName());
        dto.setStatus(ticket.getStatus());
        dto.setPriority(ticket.getPriority());
        dto.setCategory(ticket.getCategory());
        dto.setEstimatedCost(ticket.getEstimatedCost());
        dto.setCurrency(ticket.getCurrency());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setDueDate(ticket.getDueDate());
        return dto;
    }
}
package espe.edu.ec.herrerapruebap2.Services;

import espe.edu.ec.herrerapruebap2.DTO.SupportTicketRequestDTO;
import espe.edu.ec.herrerapruebap2.DTO.SupportTicketResponseDTO;
import espe.edu.ec.herrerapruebap2.Model.Currency;
import espe.edu.ec.herrerapruebap2.Model.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SupportTicketService {
    SupportTicketResponseDTO createTicket(SupportTicketRequestDTO dto);

    Page<SupportTicketResponseDTO> getTickets(
        String q,
        Status status,
        Currency currency,
        BigDecimal minCost,
        BigDecimal maxCost,
        LocalDateTime from,
        LocalDateTime to,
        Pageable pageable
    );
}
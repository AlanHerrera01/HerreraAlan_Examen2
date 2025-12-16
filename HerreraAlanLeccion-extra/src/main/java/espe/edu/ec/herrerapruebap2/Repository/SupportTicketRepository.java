package espe.edu.ec.herrerapruebap2.Repository;

import espe.edu.ec.herrerapruebap2.Model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long>, JpaSpecificationExecutor<SupportTicket> {
    boolean existsByTicketNumber(String ticketNumber);
}
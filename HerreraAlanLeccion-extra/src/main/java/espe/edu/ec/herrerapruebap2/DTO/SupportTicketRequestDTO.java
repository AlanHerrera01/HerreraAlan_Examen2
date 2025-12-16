package espe.edu.ec.herrerapruebap2.DTO;

import espe.edu.ec.herrerapruebap2.Model.Currency;
import espe.edu.ec.herrerapruebap2.Model.Priority;
import espe.edu.ec.herrerapruebap2.Model.Status;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class SupportTicketRequestDTO {
    @NotBlank
    private String requesterName;

    @NotNull
    private Status status;

    @NotNull
    private Priority priority;

    @NotBlank
    private String category;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal estimatedCost;

    @NotNull
    private Currency currency;

    @NotNull
    private LocalDate dueDate;

    // Getters and setters
    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }
    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}
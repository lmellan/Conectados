package com.conectados.conect.cita.entities.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CitaRequestDTO {
    @NotNull
    private Long servicioId;

    @NotNull
    private LocalDate fecha;

    @NotNull
    private LocalTime hora;
}

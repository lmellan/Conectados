package com.conectados.conect.cita.entities.dto;

import com.conectados.conect.cita.entities.Cita;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
public class CitaDTO {
    private Long id;
    private LocalDate fecha;
    private LocalTime hora;
    private String estado;
    
    private Long idServicio;
    private Long idBuscador;
    private Long idPrestador;
    
    private String nombreServicio;
    private String nombreBuscador;
    private String nombrePrestador;

    // Constructor para convertir de Entidad a DTO
    public CitaDTO(Cita cita) {
        this.id = cita.getId();
        this.fecha = cita.getFecha();
        this.hora = cita.getHora();
        this.estado = cita.getEstado();
        
        if (cita.getServicio() != null) {
            this.idServicio = cita.getServicio().getId();
            this.nombreServicio = cita.getServicio().getNombre();
        }
        if (cita.getBuscador() != null) {
            this.idBuscador = cita.getBuscador().getId();
            this.nombreBuscador = cita.getBuscador().getNombre();
        }
        if (cita.getPrestador() != null) {
            this.idPrestador = cita.getPrestador().getId();
            this.nombrePrestador = cita.getPrestador().getNombre();
        }
    }
}
package com.conectados.conect.servicio.entities.Dto;

import com.conectados.conect.servicio.entities.Resena;
import java.time.LocalDate;

public class ResenaDto {
    private Long id;
    private String comentario;
    private LocalDate fecha;
    private Integer valoracion;
    private Long servicioId;
    private Long buscadorId;
    private String nombreBuscador;
    private Long citaId;

    // CAMBIO 1: Se añade un constructor vacío (buena práctica requerida por frameworks).
    public ResenaDto() {
    }

    // CAMBIO 2: Se añade el constructor que convierte la entidad en un DTO.
    // ESTO SOLUCIONA EL ERROR DE COMPILACIÓN.
    public ResenaDto(Resena resena) {
        this.id = resena.getId();
        this.comentario = resena.getComentario();
        this.fecha = resena.getFecha();
        this.valoracion = resena.getValoracion();
        
        if (resena.getServicio() != null) {
            this.servicioId = resena.getServicio().getId();
        }
        if (resena.getBuscador() != null) {
            this.buscadorId = resena.getBuscador().getId();
            this.nombreBuscador = resena.getBuscador().getNombre();
        }
        if (resena.getCita() != null) {
            this.citaId = resena.getCita().getId();
        }
    }

    // --- GETTERS Y SETTERS (tu código existente) ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCitaId() { return citaId; }
    public void setCitaId(Long citaId) { this.citaId = citaId; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public Integer getValoracion() { return valoracion; }
    public void setValoracion(Integer valoracion) { this.valoracion = valoracion; }
    public Long getServicioId() { return servicioId; }
    public void setServicioId(Long servicioId) { this.servicioId = servicioId; }
    public Long getBuscadorId() { return buscadorId; }
    public void setBuscadorId(Long buscadorId) { this.buscadorId = buscadorId; }
    public String getNombreBuscador() { return nombreBuscador; }
    public void setNombreBuscador(String nombreBuscador) { this.nombreBuscador = nombreBuscador; }

    // El método estático 'fromEntity' ya no es necesario porque el nuevo constructor hace su trabajo.
    // Se puede mantener si lo usas en otras partes, pero el patrón de constructor es más común.
}
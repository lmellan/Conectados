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


    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Integer getValoracion() {
        return valoracion;
    }

    public void setValoracion(Integer valoracion) {
        this.valoracion = valoracion;
    }

    public Long getServicioId() {
        return servicioId;
    }

    public void setServicioId(Long servicioId) {
        this.servicioId = servicioId;
    }

    public Long getBuscadorId() {
        return buscadorId;
    }

    public void setBuscadorId(Long buscadorId) {
        this.buscadorId = buscadorId;
    }

    public String getNombreBuscador() {
        return nombreBuscador;
    }

    public void setNombreBuscador(String nombreBuscador) {
        this.nombreBuscador = nombreBuscador;
    }

    public static ResenaDto fromEntity(Resena resena) {
        ResenaDto dto = new ResenaDto();
        dto.setId(resena.getId());
        dto.setComentario(resena.getComentario());
        dto.setFecha(resena.getFecha());
        dto.setValoracion(resena.getValoracion());
        dto.setServicioId(resena.getServicio().getId());
        dto.setBuscadorId(resena.getBuscador().getId());
        dto.setNombreBuscador(resena.getBuscador().getNombre());
        return dto;
    }
}

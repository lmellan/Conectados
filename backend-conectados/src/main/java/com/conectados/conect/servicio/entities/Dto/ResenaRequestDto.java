package com.conectados.conect.servicio.entities.Dto;




import java.time.LocalDate;




import com.fasterxml.jackson.annotation.JsonFormat;



public class ResenaRequestDto {
    private Long servicioId;
    private Long buscadorId;
    private Long prestadorId;
    private String comentario;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecha;
    private Integer valoracion;
    private Long citaId;


    // Getters y Setters

    public Long getServicioId() { return servicioId; }
    public void setServicioId(Long servicioId) { this.servicioId = servicioId; }

    public Long getCitaId() { return citaId; }
    public void setCitaId(Long citaId) { this.citaId = citaId; }

    public Long getBuscadorId() { return buscadorId; }
    public void setBuscadorId(Long buscadorId) { this.buscadorId = buscadorId; }

    public Long getPrestadorId() { return prestadorId; }
    public void setPrestadorId(Long prestadorId) { this.prestadorId = prestadorId; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public Integer getValoracion() { return valoracion; }
    public void setValoracion(Integer valoracion) { this.valoracion = valoracion; }
}

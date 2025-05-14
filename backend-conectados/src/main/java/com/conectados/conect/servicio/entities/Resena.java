package com.conectados.conect.servicio.entities;

import com.conectados.conect.servicio.entities.Dto.ResenaDto;
import com.conectados.conect.user.model.Usuario;
import jakarta.persistence.*;


import java.time.LocalDate;

@Entity
@Table(
        name = "resenas",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"buscador_id", "servicio_id"})
        }
)

public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "servicio_id", nullable = false)
    private Servicio servicio;

    @ManyToOne
    @JoinColumn(name = "prestador_id", nullable = false)
    private Usuario prestador;

    @ManyToOne
    @JoinColumn(name = "buscador_id", nullable = false)
    private Usuario buscador;

    private String comentario;
    private LocalDate fecha;
    private Integer valoracion; // valor entre 1 y 10

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getPrestador() {
        return prestador;
    }

    public void setPrestador(Usuario prestador) {
        this.prestador = prestador;
    }

    public Usuario getBuscador() {
        return buscador;
    }

    public void setBuscador(Usuario buscador) {
        this.buscador = buscador;
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

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }

}


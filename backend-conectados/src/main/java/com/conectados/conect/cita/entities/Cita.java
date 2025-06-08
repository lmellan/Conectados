package com.conectados.conect.cita.entities;

import com.conectados.conect.servicio.entities.Resena;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.user.model.Usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data // Asegura que todos los getters (como getBuscador(), getPrestador()) y setters existan.
public class Cita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_servicio", nullable = false)
    @JsonIgnore
    private Servicio servicio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_buscador", nullable = false)
    @JsonIgnore
    private Usuario buscador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_prestador", nullable = false)
    @JsonIgnore
    private Usuario prestador;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora;

    @Column(nullable = false)
    private String estado;

    @OneToOne(mappedBy = "cita", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Resena resena;
}
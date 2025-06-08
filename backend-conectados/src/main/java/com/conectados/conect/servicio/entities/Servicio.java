package com.conectados.conect.servicio.entities;

import com.conectados.conect.cita.entities.Cita;
import com.conectados.conect.user.model.Usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data; // NUEVO: Importamos Data de Lombok

import java.util.List;

@Entity
@Data // NUEVO: Genera todos los getters, setters, toString, etc. automáticamente.
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private Double precio;
    private String zonaAtencion;
    
    // MEJORA: Se define como TEXT para permitir descripciones largas.
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // MEJORA: Se usa @Lob para indicar un Objeto Grande, ideal para Base64.
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String foto;

    private String categoria;
    
    // MEJORA: Se inicializa para evitar valores nulos.
    @Column(columnDefinition = "DOUBLE DEFAULT 0.0")
    private Double valoracionPromedio = 0.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prestador_id", nullable = false)
    @JsonIgnore // MEJORA: Evita bucles infinitos al convertir a JSON.
    private Usuario prestador;

    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // MEJORA: Evita bucles infinitos al convertir a JSON.
    private List<Resena> resenas;

    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // MEJORA: Evita bucles infinitos al convertir a JSON.
    private List<Cita> citas;

    // Con @Data de Lombok, ya no es necesario escribir los getters y setters manualmente.
}
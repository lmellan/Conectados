package com.conectados.conect.user.model;

import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String nombre;
    private String correo;
    private String contrasena;
    private String foto;
    private String numero;


    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_roles", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "rol")
    @Enumerated(EnumType.STRING)
    private List<Rol> roles = new ArrayList<>();

    // --- MODIFICACIÓN CLAVE ---
    // Se elimina @Transient y se cambia el tipo a String para que se guarde en la BD.
    private String rolActivo; 

    // Atributos solo para prestadores (se mantienen como están)
    private String zonaAtencion;

    @ElementCollection
    private List<String> categoria;

    private String descripcion;

    @ElementCollection
    private List<String> disponibilidad;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    // Atributos solo para admin (se mantienen)
    @ElementCollection
    private List<String> permisos;


    // --- Getters y Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public List<Rol> getRoles() { return roles; }
    public void setRoles(List<Rol> roles) { this.roles = roles; }

    // Getter y Setter para el nuevo rolActivo
    public String getRolActivo() { return rolActivo; }
    public void setRolActivo(String rolActivo) { this.rolActivo = rolActivo; }

    public String getZonaAtencion() { return zonaAtencion; }
    public void setZonaAtencion(String zonaAtencion) { this.zonaAtencion = zonaAtencion; }

    public List<String> getCategoria() { return categoria; }
    public void setCategoria(List<String> categoria) { this.categoria = categoria; }

    public List<String> getDisponibilidad() { return disponibilidad; }
    public void setDisponibilidad(List<String> disponibilidad) { this.disponibilidad = disponibilidad; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public List<String> getPermisos() { return permisos; }
    public void setPermisos(List<String> permisos) { this.permisos = permisos; }

    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
}
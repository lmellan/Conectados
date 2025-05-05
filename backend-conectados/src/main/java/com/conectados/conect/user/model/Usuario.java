package com.conectados.conect.user.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String correo;
    private String contrasena;
    private String imagen;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    // Atributos solo para prestadores
    private String zonaAtencion;
    private List<String> categoria;
    private String descripcion;
    private List<String> disponibilidad;

    // Atributos solo para admin
    @ElementCollection
    private List<String> permisos;


    // Getters y Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public String getZonaAtencion() {
        return zonaAtencion;
    }

    public void setZonaAtencion(String zonaAtencion) {
        this.zonaAtencion = zonaAtencion;
    }

    public List<String> getCategoria() {
        return categoria;
    }

    public void setCategoria(List<String> categoria) {
        this.categoria = categoria;
    }

    public List<String> getDisponibilidad() {
        return disponibilidad;
    }

    public void setDisponibilidad(List<String> disponibilidad) {
        this.disponibilidad = disponibilidad;
    }


    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<String> getPermisos() {
        return permisos;
    }

    public void setPermisos(List<String> permisos) {
        this.permisos = permisos;
    }


}

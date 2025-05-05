package com.conectados.conect.user.dto;

import com.conectados.conect.user.model.Rol;
import java.util.List;

public class RegistroUsuarioDto {
    private String nombre;
    private String correo;
    private String contrasena;
    private Rol rol;
    private String imagen;

    // Solo para prestadores
    private String zonaAtencion;
    private List<String> categoria;
    private String descripcion;
    private List<String> disponibilidad;

    // Getters y Setters

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public String getZonaAtencion() { return zonaAtencion; }
    public void setZonaAtencion(String zonaAtencion) { this.zonaAtencion = zonaAtencion; }

    public List<String> getCategoria() { return categoria; }
    public void setCategoria(List<String> categoria) { this.categoria = categoria; }

    public List<String> getDisponibilidad() { return disponibilidad; }
    public void setDisponibilidad(List<String> disponibilidad) { this.disponibilidad = disponibilidad; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
}


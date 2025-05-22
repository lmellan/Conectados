package com.conectados.conect.user.dto;

import com.conectados.conect.user.model.Rol;



import java.time.LocalTime;
import java.util.List;

public class RegistroUsuarioDto {
    private String nombre;
    private String correo;
    private String contrasena;

    private List<Rol> roles;

    
    private String foto;
    private String numero;

    // Solo para prestadores
    private String zonaAtencion;
    private List<String> categoria;
    private String descripcion;
    private List<String> disponibilidad;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    // --- Getters y Setters ---

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public List<Rol> getRoles() {
        return roles;
    }

    public void setRoles(List<Rol> roles) {
        this.roles = roles;
    }


    public String getZonaAtencion() { return zonaAtencion; }
    public void setZonaAtencion(String zonaAtencion) { this.zonaAtencion = zonaAtencion; }

    public List<String> getCategoria() { return categoria; }
    public void setCategoria(List<String> categoria) { this.categoria = categoria; }

    public List<String> getDisponibilidad() { return disponibilidad; }
    public void setDisponibilidad(List<String> disponibilidad) { this.disponibilidad = disponibilidad; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
}



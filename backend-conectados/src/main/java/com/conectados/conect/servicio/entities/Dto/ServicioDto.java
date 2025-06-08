package com.conectados.conect.servicio.entities.Dto;

import com.conectados.conect.servicio.entities.Servicio;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class ServicioDto {

    private Long id;
    private String nombre;
    private Double precio;
    private String zonaAtencion;
    private String descripcion;
    private String foto;
    private String categoria;
    private Double valoracionPromedio;

    // CAMBIO 1: Se reemplaza el objeto 'Usuario' por campos específicos.
    private Long prestadorId;
    private String prestadorNombre;

    private List<ResenaDto> resenas;

    // CAMBIO 2: Se añade un constructor vacío (obligatorio para los frameworks).
    public ServicioDto() {}

    // CAMBIO 3: Se añade el constructor que convierte una Entidad a DTO.
    // ESTE ES EL ARREGLO PRINCIPAL para los errores en tu ServicioController.
    public ServicioDto(Servicio servicio) {
        this.id = servicio.getId();
        this.nombre = servicio.getNombre();
        this.precio = servicio.getPrecio();
        this.zonaAtencion = servicio.getZonaAtencion();
        this.descripcion = servicio.getDescripcion();
        this.foto = servicio.getFoto();
        this.categoria = servicio.getCategoria();
        this.valoracionPromedio = servicio.getValoracionPromedio();

        if (servicio.getPrestador() != null) {
            this.prestadorId = servicio.getPrestador().getId();
            this.prestadorNombre = servicio.getPrestador().getNombre();
        }

        if (servicio.getResenas() != null) {
            this.resenas = servicio.getResenas().stream()
                    .map(ResenaDto::new) // Asumiendo que ResenaDto también tiene este patrón
                    .collect(Collectors.toList());
        } else {
            this.resenas = Collections.emptyList();
        }
    }

    // --- GETTERS Y SETTERS PARA TODOS LOS CAMPOS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public String getZonaAtencion() { return zonaAtencion; }
    public void setZonaAtencion(String zonaAtencion) { this.zonaAtencion = zonaAtencion; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Double getValoracionPromedio() { return valoracionPromedio; }
    public void setValoracionPromedio(Double valoracionPromedio) { this.valoracionPromedio = valoracionPromedio; }

    // Getters y Setters para los nuevos campos
    public Long getPrestadorId() { return prestadorId; }
    public void setPrestadorId(Long prestadorId) { this.prestadorId = prestadorId; }

    public String getPrestadorNombre() { return prestadorNombre; }
    public void setPrestadorNombre(String prestadorNombre) { this.prestadorNombre = prestadorNombre; }

    public List<ResenaDto> getResenas() { return resenas; }
    public void setResenas(List<ResenaDto> resenas) { this.resenas = resenas; }
}
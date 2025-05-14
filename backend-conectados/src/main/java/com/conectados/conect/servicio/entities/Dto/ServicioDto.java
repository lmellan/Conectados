package com.conectados.conect.servicio.entities.Dto;

import com.conectados.conect.servicio.entities.Resena;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.user.model.Usuario;

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
    private Usuario prestador;
    private List<ResenaDto> resenas;

    // Getters y setters
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

    public Usuario getPrestador() { return prestador; }
    public void setPrestador(Usuario prestador) { this.prestador = prestador; }

    public List<ResenaDto> getResenas() { return resenas; }
    public void setResenas(List<ResenaDto> resenas) { this.resenas = resenas; }


    public static ServicioDto fromEntity(Servicio servicio) {
        ServicioDto dto = new ServicioDto();
        dto.setId(servicio.getId());
        dto.setNombre(servicio.getNombre());
        dto.setPrecio(servicio.getPrecio());
        dto.setZonaAtencion(servicio.getZonaAtencion());
        dto.setDescripcion(servicio.getDescripcion());
        dto.setFoto(servicio.getFoto());
        dto.setCategoria(servicio.getCategoria());
        dto.setValoracionPromedio(servicio.getValoracionPromedio());
        dto.setPrestador(servicio.getPrestador());

        if (servicio.getResenas() != null) {
            dto.setResenas(
                    servicio.getResenas().stream()
                            .map(ResenaDto::fromEntity)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

    public static List<ServicioDto> fromEntityList(List<Servicio> servicios) {
        return servicios.stream()
                .map(ServicioDto::fromEntity)
                .collect(Collectors.toList());
    }

}

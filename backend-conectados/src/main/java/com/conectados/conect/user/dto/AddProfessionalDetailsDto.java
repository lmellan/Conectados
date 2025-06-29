package com.conectados.conect.user.dto;

import java.time.LocalTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddProfessionalDetailsDto {

    
    private List<String> categoria;

    private String zonaAtencion;

    private String descripcion;

    private List<String> disponibilidad;
    
    private LocalTime horaInicio;
    
    private LocalTime horaFin;
}
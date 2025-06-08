package com.conectados.conect.user.dto;

import java.time.LocalTime;
import java.util.List;

// Nota: Si no usas Lombok en tu proyecto, puedes borrar las siguientes dos líneas
// y escribir los métodos getter y setter manualmente para cada campo.
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddProfessionalDetailsDto {

    // Los campos que el usuario rellenará para convertirse en profesional
    
    private List<String> categoria;

    private String zonaAtencion;

    private String descripcion;

    private List<String> disponibilidad;
    
    private LocalTime horaInicio;
    
    private LocalTime horaFin;
}
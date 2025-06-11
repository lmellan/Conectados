package com.conectados.conect.servicio.services;

import com.conectados.conect.servicio.entities.Dto.ResenaDto;
import com.conectados.conect.servicio.entities.Dto.ResenaRequestDto;
import com.conectados.conect.servicio.entities.Resena;
import com.conectados.conect.servicio.entities.Servicio;
import java.util.List;

public interface ResenaServices {
    ResenaDto crearResena(Resena resena);
    Resena obtenerResenaPorId(Long id);
    List<ResenaDto> obtenerTodasLasResenas();
    List<ResenaDto> obtenerResenasPorServicio(Servicio servicio);
    Resena actualizarResena(Long id, Resena resena);
    void eliminarResena(Long id);
    ResenaDto crearResenaDesdeDto(ResenaRequestDto dto);
    ResenaDto obtenerResenaPorCitaId(Long id);
}
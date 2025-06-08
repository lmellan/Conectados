package com.conectados.conect.servicio.services;

import com.conectados.conect.servicio.entities.Dto.ResenaDto;
import com.conectados.conect.servicio.entities.Dto.ResenaRequestDto;
import com.conectados.conect.servicio.entities.Resena;
import java.util.List;
import java.util.Optional;

public interface ResenaServices {

    Resena crearResena(ResenaRequestDto resenaRequestDto);

    Optional<Resena> obtenerResenaPorId(Long id);

    List<Resena> obtenerTodasLasResenas();

    List<Resena> obtenerResenasPorServicio(Long servicioId);

    Resena actualizarResena(Long id, ResenaDto resenaDto);

    void eliminarResena(Long id);

    Optional<Resena> obtenerResenaPorCitaId(Long citaId);
}
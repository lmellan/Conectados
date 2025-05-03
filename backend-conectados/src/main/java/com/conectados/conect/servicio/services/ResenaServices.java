package com.conectados.conect.servicio.services;

import com.conectados.conect.servicio.entities.Dto.ResenaDto;
import com.conectados.conect.servicio.entities.Resena;
import com.conectados.conect.servicio.entities.Servicio;
import java.util.List;

public interface ResenaServices {
    ResenaDto crearResena(Resena resena);
    Resena obtenerResenaPorId(Long id);
    List<Resena> obtenerTodasLasResenas();
    List<Resena> obtenerResenasPorServicio(Servicio servicio);
    Resena actualizarResena(Long id, Resena resena);
    void eliminarResena(Long id);
}


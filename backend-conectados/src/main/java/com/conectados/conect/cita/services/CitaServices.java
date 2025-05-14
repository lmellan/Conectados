package com.conectados.conect.cita.services;

import com.conectados.conect.cita.entities.Cita;

import java.util.List;

public interface CitaServices {
    Cita crearCita(Cita cita);
    Cita obtenerCitaPorId(Long id);
    Cita actualizarCita(Long id, Cita cita);
    void eliminarCita(Long id);
    List<Cita> obtenerCitasPorBuscador(Long idBuscador);
    List<Cita> obtenerCitasPorPrestador(Long idPrestador);
    void actualizarEstadosDeCitas();


}
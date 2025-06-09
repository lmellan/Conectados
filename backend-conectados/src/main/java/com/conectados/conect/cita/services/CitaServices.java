package com.conectados.conect.cita.services;

import com.conectados.conect.cita.entities.dto.CitaDTO;
import com.conectados.conect.cita.entities.dto.CitaRequestDTO;
import java.util.List;
import java.util.Optional;

public interface CitaServices {

    CitaDTO crearCita(CitaDTO citaDTO);

    Optional<CitaDTO> obtenerCitaPorId(Long id);

    List<CitaDTO> obtenerCitasPorBuscador(Long idBuscador);

    List<CitaDTO> obtenerCitasPorPrestador(Long idPrestador);
    
    CitaDTO actualizarEstadoCita(Long id, String estado);

    void eliminarCita(Long id);
    
    void actualizarEstadosDeCitas();

    CitaDTO crearCitaDesdeServicio(CitaRequestDTO req, Long buscadorId);

}
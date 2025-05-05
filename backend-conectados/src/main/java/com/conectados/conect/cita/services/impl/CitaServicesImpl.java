package com.conectados.conect.cita.services.impl;

import com.conectados.conect.cita.entities.Cita;
import com.conectados.conect.cita.repositories.CitaRepository;
import com.conectados.conect.cita.services.CitaServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CitaServicesImpl implements CitaServices {

    @Autowired
    private CitaRepository citaRepository;

    @Override
    public Cita crearCita(Cita cita) {
        return citaRepository.save(cita);
    }

    @Override
    public Cita obtenerCitaPorId(Long id) {
        return citaRepository.findById(id).orElse(null);
    }

    @Override
    public Cita actualizarCita(Long id, Cita cita) {
        Optional<Cita> existente = citaRepository.findById(id);
        if (existente.isPresent()) {
            Cita c = existente.get();
            c.setIdBuscador(cita.getIdBuscador());
            c.setIdPrestador(cita.getIdPrestador());
            c.setIdServicio(cita.getIdServicio());
            c.setFecha(cita.getFecha());
            c.setHora(cita.getHora());
            c.setEstado(cita.getEstado());
            return citaRepository.save(c);
        }
        return null;
    }

    @Override
    public void eliminarCita(Long id) {
        citaRepository.deleteById(id);
    }

    @Override
    public List<Cita> obtenerCitasPorBuscador(Long idBuscador) {
        return citaRepository.findByIdBuscador(idBuscador);
    }

    @Override
    public List<Cita> obtenerCitasPorPrestador(Long idPrestador) {
        return citaRepository.findByIdPrestador(idPrestador);
    }
}
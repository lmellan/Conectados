package com.conectados.conect.servicio.services.impl;

import com.conectados.conect.cita.entities.Cita;
import com.conectados.conect.cita.repositories.CitaRepository;
import com.conectados.conect.servicio.entities.Dto.ResenaDto;
import com.conectados.conect.servicio.entities.Dto.ResenaRequestDto;
import com.conectados.conect.servicio.entities.Resena;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.servicio.repositories.ResenaRepository;
import com.conectados.conect.servicio.repositories.ServicioRepository;
import com.conectados.conect.servicio.services.ResenaServices;
import com.conectados.conect.user.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ResenaServicesImpl implements ResenaServices {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private CitaRepository citaRepository;

    @Override
    public Resena crearResena(ResenaRequestDto dto) {
        Cita cita = citaRepository.findById(dto.getCitaId())
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con id: " + dto.getCitaId()));

        if (resenaRepository.findByCita(cita).isPresent()) {
            throw new RuntimeException("La cita con id " + dto.getCitaId() + " ya tiene una reseña.");
        }

        Servicio servicio = cita.getServicio();
        Usuario buscador = cita.getBuscador();
        Usuario prestador = servicio.getPrestador();

        if (servicio == null || buscador == null || prestador == null) {
            throw new RuntimeException("La cita no tiene todas las entidades asociadas.");
        }

        Resena resena = new Resena();
        resena.setComentario(dto.getComentario());
        resena.setValoracion(dto.getValoracion());
        resena.setFecha(LocalDate.now());
        resena.setBuscador(buscador);
        resena.setServicio(servicio);
        resena.setPrestador(prestador);
        resena.setCita(cita);

        Resena resenaGuardada = resenaRepository.save(resena);
        actualizarValoracionPromedio(servicio);
        return resenaGuardada;
    }

    @Override
    public Optional<Resena> obtenerResenaPorId(Long id) {
        return resenaRepository.findById(id);
    }

    @Override
    public List<Resena> obtenerTodasLasResenas() {
        return resenaRepository.findAll();
    }

    @Override
    public List<Resena> obtenerResenasPorServicio(Long servicioId) {
        return servicioRepository.findById(servicioId)
                .map(resenaRepository::findByServicio)
                .orElse(Collections.emptyList());
    }

    @Override
    public Resena actualizarResena(Long id, ResenaDto resenaDto) {
        return resenaRepository.findById(id).map(resenaExistente -> {
            resenaExistente.setComentario(resenaDto.getComentario());
            resenaExistente.setValoracion(resenaDto.getValoracion());
            Resena resenaActualizada = resenaRepository.save(resenaExistente);
            actualizarValoracionPromedio(resenaExistente.getServicio());
            return resenaActualizada;
        }).orElseThrow(() -> new RuntimeException("Reseña no encontrada con id: " + id));
    }

    @Override
    public void eliminarResena(Long id) {
        resenaRepository.findById(id).ifPresent(resena -> {
            Servicio servicioAfectado = resena.getServicio();
            resenaRepository.delete(resena);
            if (servicioAfectado != null) {
                actualizarValoracionPromedio(servicioAfectado);
            }
        });
    }

    @Override
    public Optional<Resena> obtenerResenaPorCitaId(Long citaId) {
        return citaRepository.findById(citaId)
                .flatMap(resenaRepository::findByCita);
    }

    private void actualizarValoracionPromedio(Servicio servicio) {
        if (servicio == null) return;
        List<Resena> resenasDelServicio = resenaRepository.findByServicio(servicio);
        double promedio = resenasDelServicio.stream()
                .mapToInt(Resena::getValoracion)
                .average()
                .orElse(0.0);
        servicio.setValoracionPromedio(promedio);
        servicioRepository.save(servicio);
    }
}
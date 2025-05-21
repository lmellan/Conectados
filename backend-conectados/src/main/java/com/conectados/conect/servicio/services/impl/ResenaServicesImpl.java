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
import com.conectados.conect.user.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ResenaServicesImpl implements ResenaServices {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CitaRepository citaRepository;

    @Override
    public ResenaDto crearResenaDesdeDto(ResenaRequestDto dto) {
        System.out.println("DTO recibido:");
        System.out.println("servicioId: " + dto.getServicioId());
        System.out.println("buscadorId: " + dto.getBuscadorId());
        System.out.println("prestadorId: " + dto.getPrestadorId());
        System.out.println("citaId: " + dto.getCitaId());

        Optional<Servicio> servicioOpt = servicioRepository.findById(dto.getServicioId());
        Optional<Usuario> buscadorOpt = usuarioRepository.findById(dto.getBuscadorId());
        Optional<Usuario> prestadorOpt = usuarioRepository.findById(dto.getPrestadorId());
        Optional<Cita> citaOpt = citaRepository.findById(dto.getCitaId());

        if (servicioOpt.isEmpty()) {
            throw new RuntimeException("Servicio no encontrado");
        }
        if (buscadorOpt.isEmpty()) {
            throw new RuntimeException("Buscador no encontrado");
        }
        if (prestadorOpt.isEmpty()) {
            throw new RuntimeException("Prestador no encontrado");
        }
        if (citaOpt.isEmpty()) {
            throw new RuntimeException("Cita no encontrada");
        }

        Resena resena = new Resena();
        Servicio servicio = servicioOpt.get();

        resena.setServicio(servicio);
        resena.setBuscador(buscadorOpt.get());
        resena.setPrestador(prestadorOpt.get());
        resena.setComentario(dto.getComentario());
        resena.setFecha(dto.getFecha());
        resena.setValoracion(dto.getValoracion());
        resena.setCita(citaOpt.get());

        Resena guardada = resenaRepository.save(resena);

        // Recalcular la valoración promedio del servicio
        List<Resena> resenasDelServicio = resenaRepository.findByServicio(servicio);
        double promedio = resenasDelServicio.stream()
                .mapToInt(Resena::getValoracion)
                .average()
                .orElse(0.0);

        servicio.setValoracionPromedio(promedio);
        servicioRepository.save(servicio);

        return ResenaDto.fromEntity(guardada);
    }

    @Override
    public ResenaDto crearResena(Resena resena) {
        Optional<Servicio> servicioOpt = servicioRepository.findById(resena.getServicio().getId());
        Optional<Usuario> buscadorOpt = usuarioRepository.findById(resena.getBuscador().getId());
        Optional<Usuario> prestadorOpt = usuarioRepository.findById(resena.getPrestador().getId());

        if (servicioOpt.isPresent() && buscadorOpt.isPresent() && prestadorOpt.isPresent()) {
            resena.setServicio(servicioOpt.get());
            resena.setBuscador(buscadorOpt.get());
            resena.setPrestador(prestadorOpt.get());

            Resena guardada = resenaRepository.save(resena);
            return ResenaDto.fromEntity(guardada);
        }

        throw new RuntimeException("Entidad relacionada no encontrada");
    }

    @Override
    public Resena obtenerResenaPorId(Long id) {
        return resenaRepository.findById(id).orElse(null);
    }

    @Override
    public List<ResenaDto> obtenerTodasLasResenas() {
        List<Resena> resenas = resenaRepository.findAll();
        return resenas.stream()
                .map(ResenaDto::fromEntity)
                .toList();
    }

    @Override
    public List<ResenaDto> obtenerResenasPorServicio(Servicio servicio) {
        List<Resena> resenas = resenaRepository.findByServicio(servicio);
        return resenas.stream()
                .map(ResenaDto::fromEntity)
                .toList();
    }

    @Override
    public Resena actualizarResena(Long id, Resena resena) {
        Optional<Resena> existente = resenaRepository.findById(id);
        if (existente.isPresent()) {
            Resena r = existente.get();
            r.setComentario(resena.getComentario());
            r.setFecha(resena.getFecha());
            r.setValoracion(resena.getValoracion());
            return resenaRepository.save(r);
        }
        return null;
    }

    @Override
    public void eliminarResena(Long id) {
        resenaRepository.deleteById(id);
    }

    @Override
    public ResenaDto obtenerResenaPorCitaId(Long id) {
        Optional<Cita> citaOpt = citaRepository.findById(id);
        if (citaOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cita no encontrada.");
        }

        Optional<Resena> resenaOpt = resenaRepository.findByCita(citaOpt.get());

        return resenaOpt.map(ResenaDto::fromEntity).orElse(null);
    }


}

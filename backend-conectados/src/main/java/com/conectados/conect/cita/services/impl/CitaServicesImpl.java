package com.conectados.conect.cita.services.impl;

import com.conectados.conect.cita.entities.Cita;
import com.conectados.conect.cita.entities.dto.CitaDTO;
import com.conectados.conect.cita.repositories.CitaRepository;
import com.conectados.conect.cita.services.CitaServices;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.servicio.repositories.ServicioRepository;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CitaServicesImpl implements CitaServices {

    @Autowired
    private CitaRepository citaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ServicioRepository servicioRepository;

    @Override
    public CitaDTO crearCita(CitaDTO citaDTO) {
        Usuario buscador = usuarioRepository.findById(citaDTO.getIdBuscador())
                .orElseThrow(() -> new RuntimeException("Buscador no encontrado"));
        Usuario prestador = usuarioRepository.findById(citaDTO.getIdPrestador())
                .orElseThrow(() -> new RuntimeException("Prestador no encontrado"));
        Servicio servicio = servicioRepository.findById(citaDTO.getIdServicio())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        Cita nuevaCita = new Cita();
        nuevaCita.setFecha(citaDTO.getFecha());
        nuevaCita.setHora(citaDTO.getHora());
        nuevaCita.setEstado("Pendiente");
        nuevaCita.setBuscador(buscador);
        nuevaCita.setPrestador(prestador);
        nuevaCita.setServicio(servicio);

        Cita citaGuardada = citaRepository.save(nuevaCita);
        return new CitaDTO(citaGuardada);
    }

    @Override
    public Optional<CitaDTO> obtenerCitaPorId(Long id) {
        return citaRepository.findById(id).map(CitaDTO::new);
    }

    @Override
    public List<CitaDTO> obtenerCitasPorBuscador(Long idBuscador) {
        return citaRepository.findByBuscadorId(idBuscador).stream()
                .map(CitaDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitaDTO> obtenerCitasPorPrestador(Long idPrestador) {
        return citaRepository.findByPrestadorId(idPrestador).stream()
                .map(CitaDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public CitaDTO actualizarEstadoCita(Long id, String estado) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        cita.setEstado(estado);
        Cita citaActualizada = citaRepository.save(cita);
        return new CitaDTO(citaActualizada);
    }

    @Override
    public void eliminarCita(Long id) {
        if (!citaRepository.existsById(id)) {
            throw new RuntimeException("Cita no encontrada");
        }
        citaRepository.deleteById(id);
    }

    @Override
    public void actualizarEstadosDeCitas() {
        List<Cita> citasPendientes = citaRepository.findByEstado("PENDIENTE");
        LocalDate hoy = LocalDate.now();
        for (Cita cita : citasPendientes) {
            if (cita.getFecha().isBefore(hoy)) {
                cita.setEstado("COMPLETADA");
                citaRepository.save(cita);
            }
        }
    }
}
package com.conectados.conect.cita.services.impl;

import com.conectados.conect.cita.entities.Cita;
import com.conectados.conect.cita.repositories.CitaRepository;
import com.conectados.conect.cita.services.CitaServices;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class CitaServicesImpl implements CitaServices {

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public Cita crearCita(Cita cita) {
        // Verifica si ya existe una cita para ese prestador en esa fecha y hora
        Long conteo = citaRepository.contarCitasPorPrestadorFechaHora(
                cita.getIdPrestador(),
                cita.getFecha(),
                cita.getHora()
        );

        if (conteo > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El prestador ya tiene una cita en ese horario.");
        }

        // Verifica que el prestador exista
        Optional<Usuario> prestadorOpt = usuarioRepository.findById(cita.getIdPrestador());
        if (prestadorOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Prestador no encontrado.");
        }

        Usuario prestador = prestadorOpt.get();

        // Traduce el día a español capitalizado y verifica disponibilidad
        String diaSemana = traducirDiaADisponibilidad(cita.getFecha().getDayOfWeek());
        List<String> diasDisponibles = prestador.getDisponibilidad();

        boolean trabajaEseDia = diasDisponibles != null &&
                diasDisponibles.stream().anyMatch(d -> d.equalsIgnoreCase(diaSemana));

        if (!trabajaEseDia) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El prestador no trabaja ese día.");
        }

        // Valida que la hora esté dentro del horario permitido
        LocalTime horaCita = cita.getHora();
        if (prestador.getHoraInicio() == null || prestador.getHoraFin() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El prestador no tiene definido su horario.");
        }

        if (horaCita.isBefore(prestador.getHoraInicio()) || horaCita.isAfter(prestador.getHoraFin())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La hora está fuera del horario del prestador.");
        }

        return citaRepository.save(cita);
    }

    private String traducirDiaADisponibilidad(DayOfWeek dia) {
        return switch (dia) {
            case MONDAY -> "Lunes";
            case TUESDAY -> "Martes";
            case WEDNESDAY -> "Miércoles";
            case THURSDAY -> "Jueves";
            case FRIDAY -> "Viernes";
            case SATURDAY -> "Sábado";
            case SUNDAY -> "Domingo";
        };
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
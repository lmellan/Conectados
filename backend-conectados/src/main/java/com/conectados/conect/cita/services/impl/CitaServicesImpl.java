package com.conectados.conect.cita.services.impl;

import com.conectados.conect.cita.entities.Cita;
import com.conectados.conect.cita.repositories.CitaRepository;
import com.conectados.conect.cita.services.CitaServices;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.servicio.repositories.ServicioRepository;
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

    @Autowired
    private ServicioRepository servicioRepository;

    @Override
    public Cita crearCita(Cita cita) {
        // Verificar que el buscador tenga el rol activo de "BUSCADOR"
        Usuario buscador = usuarioRepository.findById(cita.getIdBuscador())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Buscador no encontrado"));
        if (!tieneRol(buscador, "BUSCADOR")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "El usuario no tiene el rol de Buscador");
        }

        // Verificar si el prestador tiene una cita en el mismo horario
        Long conteo = citaRepository.contarCitasPorPrestadorFechaHora(
            cita.getIdPrestador(),
            cita.getFecha(),
            cita.getHora()
        );

        if (conteo > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El prestador ya tiene una cita en ese horario.");
        }

        // Verificar que el servicio exista
        Servicio servicio = servicioRepository.findById(cita.getIdServicio())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Servicio no encontrado"));

        // Verificar que el prestador exista y sea un prestador válido
        Usuario prestador = usuarioRepository.findById(cita.getIdPrestador())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prestador no encontrado"));

        // Validar que el prestador esté disponible en esa fecha
        String diaSemana = traducirDiaADisponibilidad(cita.getFecha().getDayOfWeek());
        List<String> diasDisponibles = prestador.getDisponibilidad();

        boolean trabajaEseDia = diasDisponibles != null &&
                diasDisponibles.stream().anyMatch(d -> d.equalsIgnoreCase(diaSemana));

        if (!trabajaEseDia) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El prestador no trabaja ese día.");
        }

        // Validar la hora dentro del horario de trabajo del prestador
        LocalTime horaCita = cita.getHora();
        if (prestador.getHoraInicio() == null || prestador.getHoraFin() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El prestador no tiene definido su horario.");
        }

        if (horaCita.isBefore(prestador.getHoraInicio()) || horaCita.isAfter(prestador.getHoraFin())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La hora está fuera del horario del prestador.");
        }

        // Crear y guardar la nueva cita con los IDs
        Cita nuevaCita = new Cita();
        nuevaCita.setFecha(cita.getFecha());
        nuevaCita.setHora(cita.getHora());
        nuevaCita.setEstado("Pendiente");
        nuevaCita.setIdBuscador(cita.getIdBuscador()); // Usando ID directamente
        nuevaCita.setIdPrestador(cita.getIdPrestador()); // Usando ID directamente
        nuevaCita.setIdServicio(cita.getIdServicio()); // Usando ID directamente

        return citaRepository.save(nuevaCita);
    }

    // Método para verificar si un usuario tiene un rol específico
    private boolean tieneRol(Usuario usuario, String rol) {
        return usuario.getRolActivo() != null && usuario.getRolActivo().equals(rol);
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
        if (existente.isEmpty()) {
            return null;
        }

        // Verifica si ya existe otra cita en ese horario (excluyendo esta misma)
        Long conteo = citaRepository.contarCitasPorPrestadorFechaHoraExceptoId(
                id,
                cita.getIdPrestador(),
                cita.getFecha(),
                cita.getHora()
        );

        if (conteo > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya tienes una cita programada en ese horario.");
        }

        // Verifica que el prestador exista
        Optional<Usuario> prestadorOpt = usuarioRepository.findById(cita.getIdPrestador());
        if (prestadorOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encontró tu perfil como prestador.");
        }

        Usuario prestador = prestadorOpt.get();

        // Traduce día de la semana y verifica disponibilidad
        String diaSemana = traducirDiaADisponibilidad(cita.getFecha().getDayOfWeek());
        List<String> diasDisponibles = prestador.getDisponibilidad();

        boolean trabajaEseDia = diasDisponibles != null &&
                diasDisponibles.stream().anyMatch(d -> d.equalsIgnoreCase(diaSemana));

        if (!trabajaEseDia) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ese día no estás disponible según tu configuración.");
        }

        // Verifica que esté dentro del horario definido
        LocalTime horaCita = cita.getHora();
        if (prestador.getHoraInicio() == null || prestador.getHoraFin() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No tienes definido tu horario de atención.");
        }

        if (horaCita.isBefore(prestador.getHoraInicio()) || horaCita.isAfter(prestador.getHoraFin())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La hora está fuera de tu horario de atención.");
        }

        // Actualiza la cita
        Cita c = existente.get();
        c.setIdBuscador(cita.getIdBuscador());
        c.setIdPrestador(cita.getIdPrestador());
        c.setIdServicio(cita.getIdServicio());
        c.setFecha(cita.getFecha());
        c.setHora(cita.getHora());
        c.setEstado(cita.getEstado());

        return citaRepository.save(c);
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

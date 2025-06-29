package com.conectados.conect.test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.conectados.conect.cita.entities.Cita;
import com.conectados.conect.cita.repositories.CitaRepository;
import com.conectados.conect.cita.services.impl.CitaServicesImpl;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.servicio.repositories.ServicioRepository;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class CitaServicesImplTest {

    @Mock private CitaRepository citaRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private ServicioRepository servicioRepository;

    @InjectMocks private CitaServicesImpl citaServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //1 exito de crear cita
    @Test
    void crearCita_datosValidos_deberiaCrearCita() {
        Cita cita = new Cita();
        cita.setIdBuscador(1L);
        cita.setIdPrestador(2L);
        cita.setIdServicio(3L);
        cita.setFecha(LocalDate.of(2025, 6, 15)); // Domingo
        cita.setHora(LocalTime.of(10, 0));

        Usuario buscador = new Usuario();
        buscador.setRolActivo("BUSCADOR");

        Usuario prestador = new Usuario();
        prestador.setRolActivo("PRESTADOR");
        prestador.setHoraInicio(LocalTime.of(8, 0));
        prestador.setHoraFin(LocalTime.of(18, 0));
        prestador.setDisponibilidad(List.of("Domingo"));

        Servicio servicio = new Servicio();

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(buscador));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(prestador));
        when(servicioRepository.findById(3L)).thenReturn(Optional.of(servicio));
        when(citaRepository.contarCitasPorPrestadorFechaHora(2L, cita.getFecha(), cita.getHora()))
            .thenReturn(0L);
        when(citaRepository.save(any(Cita.class))).thenReturn(cita);

        Cita resultado = citaServices.crearCita(cita);

        assertNotNull(resultado);
        verify(citaRepository).save(any(Cita.class));
    }

    //2 conflicto al crear cita x horario ocupado
    @Test
    void crearCita_conflictoHorario_deberiaLanzarExcepcion() {
        Cita cita = new Cita();
        cita.setIdBuscador(1L);
        cita.setIdPrestador(2L);
        cita.setIdServicio(3L);
        cita.setFecha(LocalDate.now());
        cita.setHora(LocalTime.of(10, 0));

        Usuario buscador = new Usuario();
        buscador.setRolActivo("BUSCADOR");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(buscador));
        when(citaRepository.contarCitasPorPrestadorFechaHora(any(), any(), any())).thenReturn(1L);

        assertThrows(ResponseStatusException.class, () -> citaServices.crearCita(cita));
        verify(citaRepository, never()).save(any());
    }

    //3 obtener cita existente 
    @Test
    void obtenerCitaPorId_existente_deberiaRetornarCita() {
        Cita cita = new Cita();
        when(citaRepository.findById(1L)).thenReturn(Optional.of(cita));
        Cita resultado = citaServices.obtenerCitaPorId(1L);
        assertNotNull(resultado);
    }

    //4 obtener cita no existentre
    @Test
    void obtenerCitaPorId_noExiste_deberiaRetornarNull() {
        when(citaRepository.findById(1L)).thenReturn(Optional.empty());
        assertNull(citaServices.obtenerCitaPorId(1L));
    }

    //5 actualizar cita valida
    @Test
    void actualizarCita_valida_deberiaActualizarCampos() {
        Cita existente = new Cita();
        existente.setId(1L);

        Usuario prestador = new Usuario();
        prestador.setDisponibilidad(List.of("Lunes"));
        prestador.setHoraInicio(LocalTime.of(8, 0));
        prestador.setHoraFin(LocalTime.of(18, 0));

        Cita actualizada = new Cita();
        actualizada.setIdBuscador(10L);
        actualizada.setIdPrestador(20L);
        actualizada.setIdServicio(30L);
        actualizada.setFecha(LocalDate.of(2025, 6, 9)); // Lunes
        actualizada.setHora(LocalTime.of(10, 0));
        actualizada.setEstado("CONFIRMADA");

        when(citaRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(usuarioRepository.findById(20L)).thenReturn(Optional.of(prestador));
        when(citaRepository.contarCitasPorPrestadorFechaHoraExceptoId(any(), any(), any(), any()))
            .thenReturn(0L);
        when(citaRepository.save(any())).thenReturn(existente);

        Cita resultado = citaServices.actualizarCita(1L, actualizada);

        assertNotNull(resultado);
        assertEquals("CONFIRMADA", resultado.getEstado());
    }

    //6 listar citas por buscador
    @Test
    void obtenerCitas_porBuscador_deberiaRetornarLista() {
        when(citaRepository.findByIdBuscador(1L)).thenReturn(List.of(new Cita()));
        assertEquals(1, citaServices.obtenerCitasPorBuscador(1L).size());
    }

    //listar citas por prestador
    @Test
    void obtenerCitas_porPrestador_deberiaRetornarLista() {
        when(citaRepository.findByIdPrestador(2L)).thenReturn(List.of(new Cita()));
        assertEquals(1, citaServices.obtenerCitasPorPrestador(2L).size());
    }

    //actualizar estado de citas vencidas
    @Test
    void actualizarEstados_deberiaMarcarCitasCompletadas() {
        Cita cita = new Cita();
        cita.setEstado("PENDIENTE");
        cita.setFecha(LocalDate.now().minusDays(1));

        when(citaRepository.findByEstado("PENDIENTE")).thenReturn(List.of(cita));
        when(citaRepository.save(any())).thenReturn(cita);

        citaServices.actualizarEstadosDeCitas();

        assertEquals("COMPLETADA", cita.getEstado());
        verify(citaRepository).save(cita);
    }
}

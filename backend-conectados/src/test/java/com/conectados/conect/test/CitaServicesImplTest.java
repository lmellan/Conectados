package com.conectados.conect.test;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.conectados.conect.cita.entities.Cita;
import com.conectados.conect.cita.repositories.CitaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import com.conectados.conect.cita.services.impl.CitaServicesImpl;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.Optional;
import java.util.List;

class CitaServicesImplTest {

    @Mock
    private CitaRepository citaRepository;

    @InjectMocks
    private CitaServicesImpl citaServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //1 caso de exito
    @Test
    void crearCita_atributosOK_deberiaCrearCita() {
        Cita cita = new Cita();
        cita.setIdPrestador(1L);
        cita.setFecha(LocalDate.now());
        cita.setHora(LocalTime.of(10, 0));

        when(citaRepository.contarCitasPorPrestadorFechaHora(anyLong(), any(), any())).thenReturn(0L);
        when(citaRepository.save(any(Cita.class))).thenReturn(cita);

        Cita resultado = citaServices.crearCita(cita);

        assertNotNull(resultado);
        verify(citaRepository, times(1)).save(cita);
    }

    // 2 caso con conflicto
    @Test
    void crearCita_atributosConflicto_deberiaLanzarExcepcion() {
        Cita cita = new Cita();
        cita.setIdPrestador(1L);
        cita.setFecha(LocalDate.now());
        cita.setHora(LocalTime.of(10, 0));

        when(citaRepository.contarCitasPorPrestadorFechaHora(anyLong(), any(), any())).thenReturn(1L);

        assertThrows(ResponseStatusException.class, () -> citaServices.crearCita(cita));
        verify(citaRepository, never()).save(any(Cita.class));
    }
//3 probando exito
    @Test
    void obtenerCitaPorId_llamado_deberiaRetornarCitaExistente() {
        Cita cita = new Cita();
        when(citaRepository.findById(1L)).thenReturn(Optional.of(cita));

        Cita resultado = citaServices.obtenerCitaPorId(1L);

        assertNotNull(resultado);
    }

    //4 probando si cita no existe
    @Test
    void obtenerCitaPorId_noExiste_deberiaRetornarNull() {
        when(citaRepository.findById(1L)).thenReturn(Optional.empty());

        Cita resultado = citaServices.obtenerCitaPorId(1L);

        assertNull(resultado);
    }
    
    // 5 actualiza bien cita
    @Test
    void actualizarCita_atributosValidos_deberiaActualizarCampos() {
        Cita citaExistente = new Cita();
        citaExistente.setId(1L);

        Cita citaActualizada = new Cita();
        citaActualizada.setIdBuscador(2L);
        citaActualizada.setIdPrestador(3L);
        citaActualizada.setIdServicio(4L);
        citaActualizada.setFecha(LocalDate.now());
        citaActualizada.setHora(LocalTime.now());
        citaActualizada.setEstado("CONFIRMADA");

        when(citaRepository.findById(1L)).thenReturn(Optional.of(citaExistente));
        when(citaRepository.save(any(Cita.class))).thenReturn(citaExistente);

        Cita resultado = citaServices.actualizarCita(1L, citaActualizada);

        assertNotNull(resultado);
        assertEquals(2L, resultado.getIdBuscador());
        assertEquals("CONFIRMADA", resultado.getEstado());
    }
 // 6 citas por buscador
    @Test
    void obtenerCitas_porBuscador_deberiaListarCitas() {
        when(citaRepository.findByIdBuscador(1L)).thenReturn(Collections.singletonList(new Cita()));

        List<Cita> citas = citaServices.obtenerCitasPorBuscador(1L);

        assertEquals(1, citas.size());
    }

    //7 citas por prestador
     @Test
    void obtenerCitas_porPrestador_deberiaListarCitas() {
        when(citaRepository.findByIdPrestador(1L)).thenReturn(Collections.singletonList(new Cita()));

        List<Cita> citas = citaServices.obtenerCitasPorPrestador(1L);

        assertEquals(1, citas.size());
    }
// 8 actualizar citas
    @Test
    void actualizarEstadosDeCitas_pasoFecha_deberiaActualizarPendientesACompletadas() {
        Cita citaPendiente = new Cita();
        citaPendiente.setFecha(LocalDate.now().minusDays(1));
        citaPendiente.setEstado("PENDIENTE");

        when(citaRepository.findByEstado("PENDIENTE")).thenReturn(List.of(citaPendiente));
        when(citaRepository.save(any(Cita.class))).thenReturn(citaPendiente);

        citaServices.actualizarEstadosDeCitas();

        assertEquals("COMPLETADA", citaPendiente.getEstado());
        verify(citaRepository, times(1)).save(citaPendiente);
    }
}

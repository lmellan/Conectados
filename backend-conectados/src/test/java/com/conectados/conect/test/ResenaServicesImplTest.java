package com.conectados.conect.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.conectados.conect.servicio.entities.Dto.ResenaDto;
import com.conectados.conect.servicio.entities.Resena;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.servicio.repositories.ResenaRepository;
import com.conectados.conect.servicio.repositories.ServicioRepository;
import com.conectados.conect.servicio.services.impl.ResenaServicesImpl;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;
import com.conectados.conect.cita.entities.Cita;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

class ResenaServicesImplTest {

    @Mock
    private ResenaRepository resenaRepository;

    @Mock
    private ServicioRepository servicioRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ResenaServicesImpl resenaServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // 1 crear reseña correctamente
    @Test
    void crearResena_validInputs_deberiaCrearResena() {
        Servicio servicio = new Servicio();
        servicio.setId(1L);
        Usuario buscador = new Usuario();
        buscador.setId(2L);
        Usuario prestador = new Usuario();
        prestador.setId(3L);
        Resena resena = new Resena();
        resena.setServicio(servicio);
        resena.setBuscador(buscador);
        resena.setPrestador(prestador);
        
        Cita cita = new Cita();
        cita.setId(5L);
        resena.setCita(cita);

        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicio));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(buscador));
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(prestador));
        when(resenaRepository.contarResenasPorBuscadorYCita(2L, 5L)).thenReturn(0L);
        when(resenaRepository.save(any(Resena.class))).thenReturn(resena);

        ResenaDto resultado = resenaServices.crearResena(resena);

        assertNotNull(resultado);
        verify(resenaRepository, times(1)).save(resena);
    }

    // 2 no crear reseña si entidad relacionada falta
    @Test
    void crearResena_entidadRelacionadaNoEncontrada_deberiaLanzarExcepcion() {
        Resena resena = new Resena();
        Servicio servicio = new Servicio();
        servicio.setId(1L);
        resena.setServicio(servicio);
        Usuario buscador = new Usuario();
        buscador.setId(2L);
        resena.setBuscador(buscador);
        Usuario prestador = new Usuario();
        prestador.setId(3L);
        resena.setPrestador(prestador);

        when(servicioRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> {
            resenaServices.crearResena(resena);
        });
    }

    // 3 no crear reseña si ya existe una reseña para misma cita
    @Test
    void crearResena_repetidaParaCita_deberiaLanzarExcepcion() {
        Servicio servicio = new Servicio();
        servicio.setId(1L);
        Usuario buscador = new Usuario();
        buscador.setId(2L);
        Usuario prestador = new Usuario();
        prestador.setId(3L);
        Resena resena = new Resena();
        resena.setServicio(servicio);
        resena.setBuscador(buscador);
        resena.setPrestador(prestador);

        Cita cita = new Cita();

        cita.setId(5L);
        resena.setCita(cita);

        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicio));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(buscador));
        when(usuarioRepository.findById(3L)).thenReturn(Optional.of(prestador));
        when(resenaRepository.contarResenasPorBuscadorYCita(2L, 5L)).thenReturn(1L);

        assertThrows(ResponseStatusException.class, () -> {
            resenaServices.crearResena(resena);
        });
    }

    // 4 obtener reseña por ID existente
    @Test
    void obtenerResenaPorId_existente_deberiaRetornarResena() {
        Resena resena = new Resena();
        when(resenaRepository.findById(1L)).thenReturn(Optional.of(resena));

        Resena resultado = resenaServices.obtenerResenaPorId(1L);

        assertNotNull(resultado);
    }

    // 5 obtener reseña por ID no existente
    @Test
    void obtenerResenaPorId_inexistente_deberiaRetornarNull() {
        when(resenaRepository.findById(1L)).thenReturn(Optional.empty());

        Resena resultado = resenaServices.obtenerResenaPorId(1L);

        assertNull(resultado);
    }

    // 6 obtener todas las reseñas
    @Test
    void obtenerTodasLasResenas_peticion_deberiaListarResenas() {
        when(resenaRepository.findAll()).thenReturn(List.of(new Resena()));

        List<Resena> resenas = resenaServices.obtenerTodasLasResenas();

        assertEquals(1, resenas.size());
    }

    // 7 obtener reseñas por servicio
    @Test
    void obtenerResenasPorServicio_peticion_deberiaListarResenas() {
        Servicio servicio = new Servicio();
        when(resenaRepository.findByServicio(servicio)).thenReturn(List.of(new Resena()));

        List<Resena> resenas = resenaServices.obtenerResenasPorServicio(servicio);

        assertEquals(1, resenas.size());
    }

    // 8 actualizar reseña existente
    @Test
    void actualizarResena_existente_deberiaActualizarCampos() {
        Resena existente = new Resena();
        Resena actualizado = new Resena();
        actualizado.setComentario("Nuevo comentario");
        actualizado.setFecha(LocalDate.now());
        actualizado.setValoracion(8);

        when(resenaRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(resenaRepository.save(any(Resena.class))).thenReturn(existente);

        Resena resultado = resenaServices.actualizarResena(1L, actualizado);

        assertNotNull(resultado);
        assertEquals("Nuevo comentario", resultado.getComentario());
    }

    // 9 eliminar reseña
    @Test
    void eliminarResena_peticion_deberiaEliminarResena() {
        resenaServices.eliminarResena(1L);

        verify(resenaRepository, times(1)).deleteById(1L);
    }
}

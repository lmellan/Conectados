package com.conectados.conect.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.conectados.conect.servicio.entities.Dto.ServicioDto;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.servicio.repositories.ServicioRepository;
import com.conectados.conect.servicio.services.impl.ServicioServicesImpl;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;



class ServicioServicesImplTest {

    @Mock
    private ServicioRepository servicioRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ServicioServicesImpl servicioServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //1 crear servicio exitoso
    @Test
    void crearServicio_validAtributos_deberiaGuardarServicio() {
        Servicio servicio = new Servicio();
        servicio.setNombre("Servicio de prueba");
        servicio.setPrecio(10000.0);
        servicio.setZonaAtencion("Santiago");
        servicio.setCategoria("Educación");

        Usuario prestador = new Usuario();
        prestador.setId(1L);
        prestador.setNombre("Prestador Test");
        servicio.setPrestador(prestador);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(prestador));
        when(servicioRepository.save(any(Servicio.class))).thenReturn(servicio);

        Servicio resultado = servicioServices.crearServicio(servicio);

        assertNotNull(resultado);
        verify(servicioRepository, times(1)).save(servicio);
    }

    // @Test
    // void crearServicio_validAtributos_deberiaGuardarServicio() {
    //     Servicio servicio = new Servicio();
    //     when(servicioRepository.save(any(Servicio.class))).thenReturn(servicio);

    //     Servicio resultado = servicioServices.crearServicio(servicio);

    //     assertNotNull(resultado);
    //     verify(servicioRepository, times(1)).save(servicio);
    // }


    //2 test categoria no valida
        @Test
    void crearServicio_categoriaNoValida_deberiaLanzarExcepcion() {
        Servicio servicio = new Servicio();
        servicio.setNombre("Servicio de prueba");
        servicio.setPrecio(10000.0);
        servicio.setZonaAtencion("Santiago");
        servicio.setCategoria("CategoriaInexistente");

        Usuario prestador = new Usuario();
        prestador.setId(1L);
        prestador.setNombre("Prestador Test");
        servicio.setPrestador(prestador);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(prestador));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            servicioServices.crearServicio(servicio);
        });

        String expectedMessage = "Categoría no válida"; 
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
    }


    // 3 obtener servicio por id existente
    @Test
    void obtenerServicioPorId_validAtributos_deberiaRetornarServicioExistente() {
        Servicio servicio = new Servicio();
        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicio));

        Servicio resultado = servicioServices.obtenerServicioPorId(1L);

        assertNotNull(resultado);
    }

    // 4 caso de fallo al onbtener servicio por id
    @Test
    void obtenerServicioPorId_invalidId_deberiaRetornarNull() {
        when(servicioRepository.findById(1L)).thenReturn(Optional.empty());

        Servicio resultado = servicioServices.obtenerServicioPorId(1L);

        assertNull(resultado);
    }

    // 5 obtener todos los servicios
    @Test
    void obtenerTodosLosServicios_peticion_deberiaListarServicios() {
        Servicio servicio = new Servicio();
        when(servicioRepository.findAll()).thenReturn(List.of(servicio));

        List<ServicioDto> servicios = servicioServices.obtenerTodosLosServicios();

        assertEquals(1, servicios.size());
    }

    // 6 servicio por categoria
    @Test
    void obtenerServiciosPorCategoria_categoriaValida_deberiaListarServicios() {
        when(servicioRepository.findByCategoria("Educacion")).thenReturn(Collections.singletonList(new Servicio()));

        List<Servicio> servicios = servicioServices.obtenerServiciosPorCategoria("Educacion");

        assertEquals(1, servicios.size());
    }

    // 7 actualizar servicio valido 
    @Test
    void actualizarServicio_peticion_deberiaActualizarCampos() {
        Servicio servicioExistente = new Servicio();
        servicioExistente.setNombre("Viejo");

        Servicio nuevoServicio = new Servicio();
        nuevoServicio.setNombre("Nuevo");

        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicioExistente));
        when(servicioRepository.save(any(Servicio.class))).thenReturn(servicioExistente);

        Servicio actualizado = servicioServices.actualizarServicio(1L, nuevoServicio);

        assertNotNull(actualizado);
        assertEquals("Nuevo", actualizado.getNombre());
    }


    // 8 obtener servicios por prestador ID 
    @Test
    void obtenerServiciosPorPrestadorId_valido_deberiaListarServicios() {
        when(servicioRepository.findByPrestador_Id(1L)).thenReturn(List.of(new Servicio()));

        List<Servicio> servicios = servicioServices.obtenerServiciosPorPrestadorId(1L);

        assertEquals(1, servicios.size());
    }


        // 9 eliminar servicio
    @Test
    void eliminarServicio_valido_deberiaEliminarServicio() {
        servicioServices.eliminarServicio(1L);

        verify(servicioRepository, times(1)).deleteById(1L);
    }
}

// package com.conectados.conect.test;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;

// import com.conectados.conect.servicio.entities.Dto.ResenaDto;
// import com.conectados.conect.servicio.entities.Resena;
// import com.conectados.conect.servicio.entities.Servicio;
// import com.conectados.conect.servicio.repositories.ResenaRepository;
// import com.conectados.conect.servicio.repositories.ServicioRepository;
// import com.conectados.conect.servicio.services.impl.ResenaServicesImpl;
// import com.conectados.conect.user.model.Usuario;
// import com.conectados.conect.user.repository.UsuarioRepository;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.web.server.ResponseStatusException;

// import java.time.LocalDate;
// import java.util.List;
// import java.util.Optional;

// class ResenaServicesImplTest {

//     @Mock
//     private ResenaRepository resenaRepository;

//     @Mock
//     private ServicioRepository servicioRepository;

//     @Mock
//     private UsuarioRepository usuarioRepository;

//     @InjectMocks
//     private ResenaServicesImpl resenaServices;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     void crearResena_validInputs_deberiaCrearResena() {
//         Servicio servicio = new Servicio();
//         servicio.setId(1L);
//         Usuario buscador = new Usuario();
//         buscador.setId(2L);
//         Usuario prestador = new Usuario();
//         prestador.setId(3L);

//         Resena resena = new Resena();
//         resena.setServicio(servicio);
//         resena.setBuscador(buscador);
//         resena.setPrestador(prestador);
//         resena.setFecha(LocalDate.now());
//         resena.setComentario("Excelente trabajo");
//         resena.setValoracion(9);

//         when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicio));
//         when(usuarioRepository.findById(2L)).thenReturn(Optional.of(buscador));
//         when(usuarioRepository.findById(3L)).thenReturn(Optional.of(prestador));
//         when(resenaRepository.save(any(Resena.class))).thenReturn(resena);

//         ResenaDto resultado = resenaServices.crearResena(resena);

//         assertNotNull(resultado);
//         verify(resenaRepository, times(1)).save(resena);
//     }

//     @Test
//     void crearResena_entidadRelacionadaNoEncontrada_deberiaLanzarExcepcion() {
//         Resena resena = new Resena();
//         Servicio servicio = new Servicio();
//         servicio.setId(1L);
//         resena.setServicio(servicio);
//         Usuario buscador = new Usuario();
//         buscador.setId(2L);
//         resena.setBuscador(buscador);
//         Usuario prestador = new Usuario();
//         prestador.setId(3L);
//         resena.setPrestador(prestador);

//         when(servicioRepository.findById(1L)).thenReturn(Optional.empty());

//         assertThrows(ResponseStatusException.class, () -> {
//             resenaServices.crearResena(resena);
//         });
//     }

//     @Test
//     void obtenerResenaPorId_existente_deberiaRetornarResena() {
//         Resena resena = new Resena();
//         when(resenaRepository.findById(1L)).thenReturn(Optional.of(resena));

//         Resena resultado = resenaServices.obtenerResenaPorId(1L);

//         assertNotNull(resultado);
//     }

//     @Test
//     void obtenerResenaPorId_inexistente_deberiaRetornarNull() {
//         when(resenaRepository.findById(1L)).thenReturn(Optional.empty());

//         Resena resultado = resenaServices.obtenerResenaPorId(1L);

//         assertNull(resultado);
//     }

//     @Test
//     void obtenerTodasLasResenas_peticion_deberiaListarResenas() {
//         Resena resenaMock = new Resena();
//         Servicio servicio = new Servicio();
//         servicio.setId(1L);
//         Usuario buscador = new Usuario();
//         buscador.setId(2L);
//         buscador.setNombre("Pedro");
//         resenaMock.setServicio(servicio);
//         resenaMock.setBuscador(buscador);
//         resenaMock.setComentario("Muy bueno");
//         resenaMock.setFecha(LocalDate.now());
//         resenaMock.setValoracion(9);

//         when(resenaRepository.findAll()).thenReturn(List.of(resenaMock));

//         List<ResenaDto> resenas = resenaServices.obtenerTodasLasResenas();

//         assertEquals(1, resenas.size());
//         assertEquals("Muy bueno", resenas.get(0).getComentario());
//     }

//     @Test
//     void obtenerResenasPorServicio_peticion_deberiaListarResenas() {
//         Servicio servicio = new Servicio();
//         servicio.setId(1L);

//         Resena resenaMock = new Resena();
//         resenaMock.setServicio(servicio);
//         Usuario buscador = new Usuario();
//         buscador.setId(2L);
//         buscador.setNombre("Lucía");
//         resenaMock.setBuscador(buscador);
//         resenaMock.setComentario("Excelente");
//         resenaMock.setFecha(LocalDate.now());
//         resenaMock.setValoracion(10);

//         when(resenaRepository.findByServicio(servicio)).thenReturn(List.of(resenaMock));

//         List<ResenaDto> resenas = resenaServices.obtenerResenasPorServicio(servicio);

//         assertEquals(1, resenas.size());
//         assertEquals("Excelente", resenas.get(0).getComentario());
//     }


//     @Test
//     void actualizarResena_existente_deberiaActualizarCampos() {
//         Resena existente = new Resena();
//         Resena actualizado = new Resena();
//         actualizado.setComentario("Nuevo comentario");
//         actualizado.setFecha(LocalDate.now());
//         actualizado.setValoracion(8);

//         when(resenaRepository.findById(1L)).thenReturn(Optional.of(existente));
//         when(resenaRepository.save(any(Resena.class))).thenReturn(existente);

//         Resena resultado = resenaServices.actualizarResena(1L, actualizado);

//         assertNotNull(resultado);
//         assertEquals("Nuevo comentario", resultado.getComentario());
//     }

//     @Test
//     void eliminarResena_peticion_deberiaEliminarResena() {
//         resenaServices.eliminarResena(1L);

//         verify(resenaRepository, times(1)).deleteById(1L);
//     }
// }

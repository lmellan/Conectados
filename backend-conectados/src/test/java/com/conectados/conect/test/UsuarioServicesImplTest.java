package com.conectados.conect.test;

import com.conectados.conect.user.dto.AddProfessionalDetailsDto;
import com.conectados.conect.user.dto.RegistroUsuarioDto;
import com.conectados.conect.user.model.Rol;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;
import com.conectados.conect.user.service.impl.UsuarioServicesImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UsuarioServicesImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioServicesImpl usuarioServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //1 registrar un usuario nuevo
    @Test
    void registrarUsuario_nuevoCorreo_deberiaCrearUsuario() {
        RegistroUsuarioDto dto = new RegistroUsuarioDto();
        dto.setNombre("Test");
        dto.setCorreo("test@example.com");
        dto.setContrasena("password");
        dto.setRoles(List.of(Rol.BUSCADOR));

        when(usuarioRepository.findByCorreo(dto.getCorreo())).thenReturn(Optional.empty());
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(new Usuario());

        Usuario creado = usuarioServices.registrarUsuario(dto);

        assertNotNull(creado);
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    //2 registrar un usuario con correo existente
    @Test
    void registrarUsuario_correoExistente_deberiaLanzarExcepcion() {
        RegistroUsuarioDto dto = new RegistroUsuarioDto();
        dto.setCorreo("test@example.com");

        when(usuarioRepository.findByCorreo(dto.getCorreo())).thenReturn(Optional.of(new Usuario()));

        assertThrows(RuntimeException.class, () -> usuarioServices.registrarUsuario(dto));
    }

    //3 obtener usuario x id existente
    @Test
    void obtenerUsuarioPorId_existente_deberiaRetornarUsuario() {
        Usuario usuario = new Usuario();
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Optional<Usuario> encontrado = usuarioServices.obtenerUsuarioPorId(1L);

        assertTrue(encontrado.isPresent());
    }

    //4 obtener usuario x id no existente retorna null
    @Test
    void obtenerUsuarioPorId_noExistente_deberiaRetornarVacio() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Usuario> encontrado = usuarioServices.obtenerUsuarioPorId(1L);

        assertFalse(encontrado.isPresent());
    }

    //5 actualizar un usuario existente
    @Test
    void actualizarUsuario_conDTO_deberiaActualizarUsuario() {
        Usuario usuarioExistente = new Usuario();
        RegistroUsuarioDto dto = new RegistroUsuarioDto();
        dto.setNombre("Nuevo Nombre");
        dto.setCorreo("nuevo@example.com");
        dto.setContrasena("nuevaPassword");
        dto.setRoles(List.of(Rol.PRESTADOR));

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioExistente));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioExistente);

        Usuario actualizado = usuarioServices.actualizarUsuario(1L, dto);

        assertNotNull(actualizado);
        assertEquals("Nuevo Nombre", actualizado.getNombre());
    }

    //6 login de credenciales 
    @Test
    void login_credencialesValidas_deberiaAutenticar() {
        Usuario usuario = new Usuario();
        usuario.setCorreo("test@example.com");
        usuario.setContrasena("password");

        when(usuarioRepository.findByCorreo("test@example.com")).thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioServices.login("test@example.com", "password");

        assertTrue(resultado.isPresent());
    }

    //7 login incorrecto
    @Test
    void login_contrasenaIncorrecta_deberiaFallar() {
        Usuario usuario = new Usuario();
        usuario.setCorreo("test@example.com");
        usuario.setContrasena("password");

        when(usuarioRepository.findByCorreo("test@example.com")).thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioServices.login("test@example.com", "wrongpassword");

        assertFalse(resultado.isPresent());
    }

    //8 eliminar usuario existente
    @Test
    void eliminarUsuario_deberiaEliminarUsuario() {
        usuarioServices.eliminarUsuario(1L);

        verify(usuarioRepository, times(1)).deleteById(1L);
    }

    //listar usuarios
    @Test
    void listarUsuarios_deberiaRetornarUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(List.of(new Usuario()));

        List<Usuario> usuarios = usuarioServices.listarUsuarios();

        assertEquals(1, usuarios.size());
    }

    
}

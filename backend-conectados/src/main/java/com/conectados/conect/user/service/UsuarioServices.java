package com.conectados.conect.user.service;


import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.dto.RegistroUsuarioDto;

import java.util.List;
import java.util.Optional;

public interface UsuarioServices {

    Usuario registrarUsuario(RegistroUsuarioDto dto);

    Optional<Usuario> login(String correo, String contrasena);

    Optional<Usuario> obtenerUsuarioPorId(Long id);

    Usuario actualizarUsuario(Long id, RegistroUsuarioDto dto);

    void eliminarUsuario(Long id);

    List<Usuario> listarUsuarios();
    
    Usuario actualizarUsuario(Long id, Usuario usuarioActualizado);


}

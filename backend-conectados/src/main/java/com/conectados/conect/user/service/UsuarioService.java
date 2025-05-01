package com.conectados.conect.user.service;

import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario registrarUsuario(Usuario usuario) {
        //se valida que no exita el correo del usuario
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        // usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));

        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    public boolean existeCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }
}

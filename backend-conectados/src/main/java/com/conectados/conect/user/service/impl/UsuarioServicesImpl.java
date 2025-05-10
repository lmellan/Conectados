package com.conectados.conect.user.service.impl;

import com.conectados.conect.user.dto.RegistroUsuarioDto;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;
import com.conectados.conect.user.service.UsuarioServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServicesImpl implements UsuarioServices {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public Usuario registrarUsuario(RegistroUsuarioDto dto) {
        Optional<Usuario> existente = usuarioRepository.findByCorreo(dto.getCorreo());
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe una cuenta con este correo");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setCorreo(dto.getCorreo());
        usuario.setContrasena(dto.getContrasena());
        usuario.setRol(dto.getRol());
        usuario.setImagen(dto.getImagen());

        if (dto.getRol().name().equals("PRESTADOR")) {
            usuario.setZonaAtencion(dto.getZonaAtencion());
            usuario.setCategoria(dto.getCategoria());
            usuario.setDescripcion(dto.getDescripcion());
            usuario.setDisponibilidad(dto.getDisponibilidad());
        }

        return usuarioRepository.save(usuario);
    }


    @Override
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Usuario actualizarUsuario(Long id, RegistroUsuarioDto dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setNombre(dto.getNombre());
            usuario.setCorreo(dto.getCorreo());
            usuario.setContrasena(dto.getContrasena());
            usuario.setRol(dto.getRol());
            usuario.setImagen(dto.getImagen());


            if (dto.getRol().name().equals("PRESTADOR")) {
                usuario.setZonaAtencion(dto.getZonaAtencion());
                usuario.setCategoria(dto.getCategoria());
                usuario.setDescripcion(dto.getDescripcion());
                usuario.setDisponibilidad(dto.getDisponibilidad());
            }

            return usuarioRepository.save(usuario);
        }
        return null;
    }

    @Override
    public Optional<Usuario> login(String correo, String contrasena) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getContrasena().equals(contrasena)) {
                return Optional.of(usuario); // autenticación exitosa
            }
        }
        return Optional.empty(); // falló login
    }


    @Override
    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
    return usuarioRepository.findById(id)
            .map(usuarioExistente -> {
                usuarioExistente.setNombre(usuarioActualizado.getNombre());
                usuarioExistente.setCorreo(usuarioActualizado.getCorreo());
                usuarioExistente.setContrasena(usuarioActualizado.getContrasena());
                usuarioExistente.setZonaAtencion(usuarioActualizado.getZonaAtencion());
                usuarioExistente.setImagen(usuarioActualizado.getImagen());
                return usuarioRepository.save(usuarioExistente);
            })
            .orElse(null);
}

}

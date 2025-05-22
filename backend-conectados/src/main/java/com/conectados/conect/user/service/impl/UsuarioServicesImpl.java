package com.conectados.conect.user.service.impl;

import com.conectados.conect.user.dto.RegistroUsuarioDto;
import com.conectados.conect.user.model.Rol;
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

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setCorreo(dto.getCorreo());
        usuario.setContrasena(dto.getContrasena());
        usuario.setRoles(dto.getRoles());

        //Nuevos campos
        usuario.setFoto(dto.getFoto());
        usuario.setNumero(dto.getNumero());

        if (dto.getRoles().contains(Rol.PRESTADOR)) {
            usuario.setZonaAtencion(dto.getZonaAtencion());
            usuario.setCategoria(dto.getCategoria());
            usuario.setDescripcion(dto.getDescripcion());
            usuario.setDisponibilidad(dto.getDisponibilidad());
            usuario.setHoraInicio(dto.getHoraInicio());
            usuario.setHoraFin(dto.getHoraFin());
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
            usuario.setRoles(dto.getRoles());

            // Nuevos campos
            usuario.setFoto(dto.getFoto());
            usuario.setNumero(dto.getNumero());

            if (dto.getRoles().contains(Rol.PRESTADOR)) {
                usuario.setZonaAtencion(dto.getZonaAtencion());
                usuario.setCategoria(dto.getCategoria());
                usuario.setDescripcion(dto.getDescripcion());
                usuario.setDisponibilidad(dto.getDisponibilidad());
                usuario.setHoraInicio(dto.getHoraInicio());
                usuario.setHoraFin(dto.getHoraFin());
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
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
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
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // Solo actualizamos algunos campos que pueden cambiar libremente
            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setCorreo(usuarioActualizado.getCorreo());
            usuario.setContrasena(usuarioActualizado.getContrasena());
            usuario.setFoto(usuarioActualizado.getFoto());
            usuario.setNumero(usuarioActualizado.getNumero());
            usuario.setZonaAtencion(usuarioActualizado.getZonaAtencion());
            usuario.setCategoria(usuarioActualizado.getCategoria());
            usuario.setDescripcion(usuarioActualizado.getDescripcion());
            usuario.setDisponibilidad(usuarioActualizado.getDisponibilidad());
            usuario.setHoraInicio(usuarioActualizado.getHoraInicio());
            usuario.setHoraFin(usuarioActualizado.getHoraFin());

            usuario.setRolActivo(usuarioActualizado.getRolActivo());

            return usuarioRepository.save(usuario);
        }
        return null;
    }

}

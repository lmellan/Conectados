package com.conectados.conect.user.service.impl;

import com.conectados.conect.user.dto.AddProfessionalDetailsDto;
import com.conectados.conect.user.dto.RegistroUsuarioDto;
import com.conectados.conect.user.model.Rol;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;
import com.conectados.conect.user.service.UsuarioServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServicesImpl implements UsuarioServices {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // --- NUEVO MÉTODO IMPLEMENTADO ---
    @Override
    public Optional<Usuario> findByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    @Override
    public Usuario registrarUsuario(RegistroUsuarioDto dto) {
        // Verificar si el correo ya está registrado
        Optional<Usuario> usuarioExistente = usuarioRepository.findByCorreo(dto.getCorreo());
        if (usuarioExistente.isPresent()) {
            throw new RuntimeException("El correo electrónico ya está registrado"); // Excepción si el correo ya existe
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setCorreo(dto.getCorreo());
        usuario.setContrasena(dto.getContrasena()); 
        usuario.setFoto(dto.getFoto());
        usuario.setNumero(dto.getNumero());

        List<Rol> roles = dto.getRoles();

        if (roles == null || roles.isEmpty()) {
            roles = new ArrayList<>();
            roles.add(Rol.BUSCADOR);
        }
        usuario.setRoles(roles);

        usuario.setRolActivo(Rol.BUSCADOR.name());
        
        if (roles.contains(Rol.PRESTADOR)) {
            usuario.setZonaAtencion(dto.getZonaAtencion());
            usuario.setCategoria(dto.getCategoria());
            usuario.setDescripcion(dto.getDescripcion());
            usuario.setDisponibilidad(dto.getDisponibilidad());
            usuario.setHoraInicio(dto.getHoraInicio());
            usuario.setHoraFin(dto.getHoraFin());
            usuario.setRolActivo(Rol.PRESTADOR.name());
        }

        return usuarioRepository.save(usuario);
    }
    
    @Override
    public Optional<Usuario> login(String correo, String contrasena) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo.trim());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getContrasena().equals(contrasena)) {
                if (usuario.getRolActivo() == null || usuario.getRolActivo().isBlank()) {
                    usuario.setRolActivo(Rol.BUSCADOR.name());
                    usuarioRepository.save(usuario);
                }
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
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

    @Override
    public Usuario addProfessionalDetails(String correo, AddProfessionalDetailsDto detailsDto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            List<Rol> roles = usuario.getRoles();
            if (!roles.contains(Rol.PRESTADOR)) {
                roles.add(Rol.PRESTADOR);
                usuario.setRoles(roles);
            }
            usuario.setCategoria(detailsDto.getCategoria());
            usuario.setZonaAtencion(detailsDto.getZonaAtencion());
            usuario.setDescripcion(detailsDto.getDescripcion());
            usuario.setDisponibilidad(detailsDto.getDisponibilidad());
            usuario.setHoraInicio(detailsDto.getHoraInicio());
            usuario.setHoraFin(detailsDto.getHoraFin());
            usuario.setRolActivo(Rol.PRESTADOR.name());
            return usuarioRepository.save(usuario);
        }
        return null;
    }
}

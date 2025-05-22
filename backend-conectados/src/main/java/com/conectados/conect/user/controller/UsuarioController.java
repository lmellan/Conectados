package com.conectados.conect.user.controller;


import com.conectados.conect.user.dto.CambioRolDto;
import com.conectados.conect.user.dto.LoginDto;
import com.conectados.conect.user.dto.RegistroUsuarioDto;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.service.UsuarioServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioServices usuarioService;

    @GetMapping("/id/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        return usuarioService.obtenerUsuarioPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody RegistroUsuarioDto dto) {
        Usuario actualizado = usuarioService.actualizarUsuario(id, dto);
        return actualizado != null ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarUsuarios();
        return ResponseEntity.ok(usuarios);
    }


    // UsuarioController.java
@PutMapping("/{id}/cambiar-rol")
public ResponseEntity<?> cambiarRolActivo(
    @PathVariable Long id,
    @RequestBody CambioRolDto dto) {

    Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorId(id);
    if (usuarioOpt.isPresent()) {
        Usuario usuario = usuarioOpt.get();
        if (!usuario.getRoles().contains(dto.getNuevoRol())) {
            return ResponseEntity.badRequest().body("El usuario no tiene ese rol");
        }
        usuario.setRolActivo(dto.getNuevoRol());
        usuarioService.actualizarUsuario(id, usuario); 
        return ResponseEntity.ok("Rol activo cambiado exitosamente");
    } else {
        return ResponseEntity.notFound().build();
    }
}




}

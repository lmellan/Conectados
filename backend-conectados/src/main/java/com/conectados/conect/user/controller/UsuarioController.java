package com.conectados.conect.user.controller;


import com.conectados.conect.user.dto.LoginDTO;
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
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
        Usuario actualizado = usuarioService.actualizarUsuario(id, usuarioActualizado);
        return actualizado != null ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
}


}

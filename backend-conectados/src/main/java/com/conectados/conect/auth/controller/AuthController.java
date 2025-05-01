package com.conectados.conect.auth.controller;

import com.conectados.conect.user.dto.LoginDTO;
import com.conectados.conect.user.dto.UsuarioRegistroDTO;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    @Autowired
    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioRegistroDTO dto) {
        Usuario nuevo = new Usuario();
        nuevo.setNombre(dto.getNombre());
        nuevo.setCorreo(dto.getCorreo());
        nuevo.setContraseña(dto.getContraseña());
        nuevo.setRol(dto.getRol());

        Usuario registrado = usuarioService.registrarUsuario(nuevo);
        return ResponseEntity.ok("Usuario registrado correctamente");
    }

    @PostMapping("/login")
public ResponseEntity<?> loginUsuario(@RequestBody LoginDTO loginDTO) {
    Usuario usuario = usuarioService.obtenerPorCorreo(loginDTO.getCorreo());

    if (usuario == null || !usuario.getContraseña().equals(loginDTO.getContraseña())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
    }

    return ResponseEntity.ok("Inicio de sesión exitoso para: " + usuario.getNombre());
}

}

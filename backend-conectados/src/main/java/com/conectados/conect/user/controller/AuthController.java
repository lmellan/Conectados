package com.conectados.conect.user.controller;


import com.conectados.conect.user.dto.LoginDto;

import com.conectados.conect.user.dto.RegistroUsuarioDto;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.service.UsuarioServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UsuarioServices usuarioService;

    @PostMapping("/register")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody RegistroUsuarioDto dto) {
        Usuario creado = usuarioService.registrarUsuario(dto);
        return ResponseEntity.ok(creado);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {

        Optional<Usuario> usuario = usuarioService.login(dto.getCorreo(), dto.getContrasena());
        return usuario.isPresent()
                ? ResponseEntity.ok(usuario.get())
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }
}

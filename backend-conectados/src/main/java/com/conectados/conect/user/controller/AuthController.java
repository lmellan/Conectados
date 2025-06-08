package com.conectados.conect.user.controller;

import com.conectados.conect.user.dto.LoginDto;
import com.conectados.conect.user.dto.RegistroUsuarioDto;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.service.UsuarioServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// NUEVO: Imports para construir el mapa de respuesta
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
// MODIFICADO: Se añade "/api" para que la ruta coincida con la del frontend.
@RequestMapping("/api/auth") 
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UsuarioServices usuarioService;

    @PostMapping("/register")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody RegistroUsuarioDto dto) {
        Usuario creado = usuarioService.registrarUsuario(dto);
        return new ResponseEntity<>(creado, HttpStatus.CREATED);
    }

    // MODIFICADO: El método de login ahora devuelve la estructura que el frontend espera.
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto dto) {
        // La llamada al servicio sigue igual, usando los campos correctos del DTO.
        Optional<Usuario> usuarioOpt = usuarioService.login(dto.getCorreo(), dto.getContrasena());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            
            // 1. Creamos un mapa para estructurar la respuesta.
            Map<String, Object> response = new HashMap<>();
            
            // 2. Añadimos un token (en un futuro, aquí se generaría un JWT real).
            response.put("token", "token-de-ejemplo-jwt-para-" + usuario.getCorreo());
            
            // 3. Añadimos el objeto de usuario.
            response.put("usuario", usuario);
            
            // 4. Devolvemos el mapa como cuerpo de la respuesta OK.
            return ResponseEntity.ok(response);
        } else {
            // Si las credenciales no son válidas, devolvemos un error.
            return new ResponseEntity<>("Credenciales inválidas", HttpStatus.UNAUTHORIZED);
        }
    }
}
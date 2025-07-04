package com.conectados.conect.user.controller;

import com.conectados.conect.user.dto.AddProfessionalDetailsDto;
import com.conectados.conect.user.dto.CambioRolDto;
import com.conectados.conect.user.dto.RegistroUsuarioDto;
import com.conectados.conect.user.model.Rol;
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
    
    @PutMapping("/{correo}/add-professional-details")
    public ResponseEntity<Usuario> addProfessionalDetails(
            @PathVariable String correo,
            @RequestBody AddProfessionalDetailsDto detailsDto) {
        Usuario usuarioActualizado = usuarioService.addProfessionalDetails(correo, detailsDto);
        return (usuarioActualizado != null) ? ResponseEntity.ok(usuarioActualizado) : ResponseEntity.notFound().build();
    }
    
    // --- ENDPOINT CORREGIDO PARA CAMBIAR ROL ---
    // La ruta es más clara y usa el correo como identificador, no el ID.
    @PutMapping("/{correo}/cambiar-rol")
    public ResponseEntity<?> cambiarRolActivo(
            @PathVariable String correo,
            @RequestBody CambioRolDto dto) {
        
        // La lógica se podría mover a un servicio, pero por ahora la mantenemos aquí para claridad.
        Optional<Usuario> usuarioOpt = usuarioService.findByCorreo(correo); // Usamos un método que debe existir en el servicio

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            
            // Verifica que el usuario posea el rol al que intenta cambiar.
            // El DTO envía un Enum, así que la comparación es directa.
            if (usuario.getRoles() == null || !usuario.getRoles().contains(dto.getNuevoRol())) {
                return ResponseEntity.badRequest().body("El usuario no tiene el rol: " + dto.getNuevoRol());
            }

            // Actualiza el rol activo y guarda.
            usuario.setRolActivo(dto.getNuevoRol().name());
            usuarioService.actualizarUsuario(usuario.getId(), usuario); // Usamos el método de actualizar existente
            
            return ResponseEntity.ok(usuario); // Devolvemos el usuario actualizado
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- El resto de los endpoints ---
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
        System.out.println(" Eliminando usuario con ID: " + id); 
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }
}
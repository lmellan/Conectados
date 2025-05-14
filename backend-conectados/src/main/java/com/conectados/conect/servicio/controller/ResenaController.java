package com.conectados.conect.servicio.controller;

import com.conectados.conect.servicio.entities.Dto.ResenaDto;
import com.conectados.conect.servicio.entities.Dto.ServicioDto;
import com.conectados.conect.servicio.entities.Resena;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.servicio.services.ResenaServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin("*")
public class ResenaController {

    @Autowired
    private ResenaServices resenaService;

    @PostMapping("/crear")
    public ResponseEntity<ResenaDto> crear(@RequestBody Resena resena) {
        ResenaDto creada = resenaService.crearResena(resena);
        return ResponseEntity.ok(creada);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ResenaDto> obtenerPorId(@PathVariable Long id) {
        Resena r = resenaService.obtenerResenaPorId(id);
        return r != null
                ? ResponseEntity.ok(ResenaDto.fromEntity(r))
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/servicio/{idServicio}")
    public ResponseEntity<List<Resena>> obtenerPorServicio(@PathVariable Long idServicio) {
        Servicio servicio = new Servicio();
        servicio.setId(idServicio);
        return ResponseEntity.ok(resenaService.obtenerResenasPorServicio(servicio));
    }

    @GetMapping("/todas")
    public ResponseEntity<List<ResenaDto>> obtenerTodas() {
        List<Resena> resenas = resenaService.obtenerTodasLasResenas();
        List<ResenaDto> resenasDto = resenas.stream()
                .map(ResenaDto::fromEntity)
                .toList();

        return ResponseEntity.ok(resenasDto);
    }


    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Resena> actualizar(@PathVariable Long id, @RequestBody Resena resena) {
        Resena actualizada = resenaService.actualizarResena(id, resena);
        return actualizada != null ? ResponseEntity.ok(actualizada) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        resenaService.eliminarResena(id);
        return ResponseEntity.noContent().build();
    }
}

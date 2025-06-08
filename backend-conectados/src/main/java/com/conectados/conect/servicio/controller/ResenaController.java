package com.conectados.conect.servicio.controller;

import com.conectados.conect.servicio.entities.Dto.ResenaDto;
import com.conectados.conect.servicio.entities.Dto.ResenaRequestDto;
import com.conectados.conect.servicio.entities.Resena;
import com.conectados.conect.servicio.services.ResenaServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin("*")
public class ResenaController {

    @Autowired
    private ResenaServices resenaService;

    @PostMapping("/crear")
    public ResponseEntity<ResenaDto> crearResena(@RequestBody ResenaRequestDto resenaRequestDto) {
        Resena nuevaResena = resenaService.crearResena(resenaRequestDto);
        return new ResponseEntity<>(new ResenaDto(nuevaResena), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResenaDto> obtenerPorId(@PathVariable Long id) {
        return resenaService.obtenerResenaPorId(id)
                .map(resena -> ResponseEntity.ok(new ResenaDto(resena)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/servicio/{idServicio}")
    public ResponseEntity<List<ResenaDto>> obtenerPorServicio(@PathVariable Long idServicio) {
        List<Resena> resenas = resenaService.obtenerResenasPorServicio(idServicio);
        List<ResenaDto> dtos = resenas.stream().map(ResenaDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/todas")
    public ResponseEntity<List<ResenaDto>> obtenerTodas() {
        List<Resena> resenas = resenaService.obtenerTodasLasResenas();
        List<ResenaDto> dtos = resenas.stream().map(ResenaDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<ResenaDto> actualizar(@PathVariable Long id, @RequestBody ResenaDto resenaDto) {
        Resena actualizada = resenaService.actualizarResena(id, resenaDto);
        return (actualizada != null) 
                ? ResponseEntity.ok(new ResenaDto(actualizada))
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        resenaService.eliminarResena(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/citaid/{id}")
    public ResponseEntity<ResenaDto> obtenerPorCita(@PathVariable Long id) {
        return resenaService.obtenerResenaPorCitaId(id)
                .map(resena -> ResponseEntity.ok(new ResenaDto(resena)))
                .orElse(ResponseEntity.ok(null));
    }
}
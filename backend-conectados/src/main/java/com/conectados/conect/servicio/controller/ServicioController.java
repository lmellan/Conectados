package com.conectados.conect.servicio.controller;

import com.conectados.conect.servicio.entities.Dto.ServicioDto;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.servicio.services.ServicioServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador para gestionar las operaciones CRUD de los Servicios.
 * Sigue el patrón de recibir y devolver DTOs para desacoplar la capa web de la de dominio.
 */
@RestController
@RequestMapping("/api/servicios")
@CrossOrigin("*")
public class ServicioController {

    @Autowired
    private ServicioServices servicioService;

    @PostMapping("/crear")
    public ResponseEntity<Servicio> crearServicio(@RequestBody ServicioDto servicioDto) {
        Servicio nuevoServicio = servicioService.crearServicio(servicioDto);
        return new ResponseEntity<>(nuevoServicio, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicioDto> obtenerServicioPorId(@PathVariable Long id) {
        return servicioService.obtenerServicioPorId(id)
                .map(servicio -> ResponseEntity.ok(new ServicioDto(servicio)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/todos")
    public ResponseEntity<List<ServicioDto>> obtenerTodos() {
        List<Servicio> servicios = servicioService.obtenerTodosLosServicios();
        List<ServicioDto> dtos = servicios.stream()
                .map(ServicioDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<ServicioDto> actualizarServicio(@PathVariable Long id, @RequestBody ServicioDto servicioDto) {
        Servicio actualizado = servicioService.actualizarServicio(id, servicioDto);
        return (actualizado != null)
                ? ResponseEntity.ok(new ServicioDto(actualizado))
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<ServicioDto>> obtenerPorCategoria(@PathVariable String categoria) {
        List<Servicio> servicios = servicioService.obtenerServiciosPorCategoria(categoria);
        List<ServicioDto> dtos = servicios.stream().map(ServicioDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/prestador/{id}")
    public ResponseEntity<List<ServicioDto>> obtenerServiciosPorPrestador(@PathVariable Long id) {
        // MODIFICADO: Se llama al método con el nombre corregido de la interfaz.
        List<Servicio> servicios = servicioService.obtenerServiciosPorPrestador(id);
        List<ServicioDto> dtos = servicios.stream().map(ServicioDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
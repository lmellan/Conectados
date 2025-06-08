package com.conectados.conect.cita.controller;

import com.conectados.conect.cita.entities.dto.CitaDTO;
import com.conectados.conect.cita.services.CitaServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin("*")
public class CitaController {

    @Autowired
    private CitaServices citaServices;

    @PostMapping("/crear")
    public ResponseEntity<CitaDTO> crearCita(@RequestBody CitaDTO citaDTO) {
        CitaDTO nuevaCita = citaServices.crearCita(citaDTO);
        return new ResponseEntity<>(nuevaCita, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CitaDTO> obtenerCitaPorId(@PathVariable Long id) {
        return citaServices.obtenerCitaPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscador/{idBuscador}")
    public ResponseEntity<List<CitaDTO>> obtenerCitasPorBuscador(@PathVariable Long idBuscador) {
        List<CitaDTO> citas = citaServices.obtenerCitasPorBuscador(idBuscador);
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/prestador/{idPrestador}")
    public ResponseEntity<List<CitaDTO>> obtenerCitasPorPrestador(@PathVariable Long idPrestador) {
        List<CitaDTO> citas = citaServices.obtenerCitasPorPrestador(idPrestador);
        return ResponseEntity.ok(citas);
    }

    @PutMapping("/{id}/actualizar-estado")
    public ResponseEntity<CitaDTO> actualizarEstadoCita(@PathVariable Long id, @RequestBody String estado) {
        CitaDTO citaActualizada = citaServices.actualizarEstadoCita(id, estado.replace("\"", "")); // Limpia comillas si vienen del JSON
        return ResponseEntity.ok(citaActualizada);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarCita(@PathVariable Long id) {
        citaServices.eliminarCita(id);
        return ResponseEntity.noContent().build();
    }
}
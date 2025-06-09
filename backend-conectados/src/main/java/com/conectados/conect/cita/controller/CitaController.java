package com.conectados.conect.cita.controller;

import com.conectados.conect.cita.entities.dto.CitaDTO;
import com.conectados.conect.cita.services.CitaServices;
import com.conectados.conect.cita.entities.dto.CitaRequestDTO;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin("*")
public class CitaController {

    @Autowired
    private CitaServices citaServices;

    @GetMapping("/{id}")
    public ResponseEntity<CitaDTO> obtenerCitaPorId(@PathVariable Long id) {
        return citaServices.obtenerCitaPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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

    @PostMapping
    @PreAuthorize("hasAuthority('ROL_ACTIVO_BUSCADOR')")
    public ResponseEntity<CitaDTO> reservar(@Valid @RequestBody CitaRequestDTO req,
                                            Principal principal) {
        Long buscadorId = Long.valueOf(principal.getName());
        CitaDTO nuevaCita = citaServices.crearCitaDesdeServicio(req, buscadorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCita);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROL_ACTIVO_BUSCADOR')")
    public ResponseEntity<List<CitaDTO>> misCitas(Principal principal) {
        Long buscadorId = Long.valueOf(principal.getName());
        var lista = citaServices.obtenerCitasPorBuscador(buscadorId);
        return ResponseEntity.ok(lista);
    }


    @GetMapping("/prestador/{idPrestador}")
    @PreAuthorize("hasAuthority('ROL_ACTIVO_PRESTADOR')")
    public ResponseEntity<List<CitaDTO>> citasDelPrestador(@PathVariable Long idPrestador) {
        List<CitaDTO> lista = citaServices.obtenerCitasPorPrestador(idPrestador);
        return ResponseEntity.ok(lista);
    }


}
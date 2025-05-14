package com.conectados.conect.cita.controller;

import com.conectados.conect.cita.entities.Cita;
import com.conectados.conect.cita.services.CitaServices;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<Cita> crearCita(@RequestBody Cita cita) {
        return ResponseEntity.ok(citaServices.crearCita(cita));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cita> obtenerCita(@PathVariable Long id) {
        return ResponseEntity.ok(citaServices.obtenerCitaPorId(id));
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Cita> editarCita(@PathVariable Long id, @RequestBody Cita cita) {
        return ResponseEntity.ok(citaServices.actualizarCita(id, cita));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarCita(@PathVariable Long id) {
        citaServices.eliminarCita(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscador/{idBuscador}")
    public ResponseEntity<List<Cita>> obtenerPorBuscador(@PathVariable Long idBuscador) {
        return ResponseEntity.ok(citaServices.obtenerCitasPorBuscador(idBuscador));
    }

    @GetMapping("/prestador/{idPrestador}")
    public ResponseEntity<List<Cita>> obtenerPorPrestador(@PathVariable Long idPrestador) {
        return ResponseEntity.ok(citaServices.obtenerCitasPorPrestador(idPrestador));
    }

    @PutMapping("/citas/finalizar/{id}")
    public ResponseEntity<?> finalizarCita(@PathVariable Long id) {
        // Add implementation for finalizarCita here
        return ResponseEntity.ok().build();
    }

    @PutMapping("/actualizar-automatica")
    public ResponseEntity<String> actualizarCitasAutomaticamente() {
        citaServices.actualizarEstadosDeCitas();
        return ResponseEntity.ok("Estados de las citas actualizados automáticamente.");
    }


    }


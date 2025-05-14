package com.conectados.conect.cita.repositories;

import com.conectados.conect.cita.entities.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {
    List<Cita> findByIdBuscador(Long idBuscador);
    List<Cita> findByIdPrestador(Long idPrestador);

    @Query("SELECT COUNT(c) FROM Cita c WHERE c.idPrestador = :prestadorId AND c.fecha = :fecha AND c.hora = :hora")
    Long contarCitasPorPrestadorFechaHora(
        @Param("prestadorId") Long prestadorId,
        @Param("fecha") LocalDate fecha,
        @Param("hora") LocalTime hora
    );
    List<Cita> findByEstado(String estado);

}

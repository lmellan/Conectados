package com.conectados.conect.servicio.repositories;

import com.conectados.conect.servicio.entities.Resena;
import com.conectados.conect.servicio.entities.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResenaRepository extends JpaRepository<Resena, Long> {
    List<Resena> findByServicio(Servicio servicio);

    //método para saber si cliente ya hizo reseña para cita específica.
    @Query("SELECT COUNT(r) FROM Resena r WHERE r.buscador.id = :buscadorId AND r.cita.id = :citaId")
Long contarResenasPorBuscadorYCita(@Param("buscadorId") Long buscadorId, @Param("citaId") Long citaId);
}


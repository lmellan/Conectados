package com.conectados.conect.cita.repositories;

import com.conectados.conect.cita.entities.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface CitaRepository extends JpaRepository<Cita, Long> {
    
    // Nombres correctos para buscar por el ID de una entidad relacionada
    List<Cita> findByBuscadorId(Long buscadorId);
    List<Cita> findByPrestadorId(Long prestadorId);
    
    // MODIFICADO: Se elimina el método 'findByCitaId' que causaba el error de arranque.
    // El método findById(Long id) ya es proporcionado por JpaRepository y hace lo mismo.
    // No necesitamos declararlo de nuevo.
    
    List<Cita> findByEstado(String estado);

    // Se mantiene tu query personalizada.
    @Query("SELECT COUNT(c) FROM Cita c WHERE c.prestador.id = :prestadorId AND c.fecha = :fecha AND c.hora = :hora")
    Long contarCitasPorPrestadorFechaHora(
        @Param("prestadorId") Long prestadorId,
        @Param("fecha") LocalDate fecha,
        @Param("hora") LocalTime hora
    );

    // Se mantiene tu otra query.
    @Query("SELECT COUNT(c) FROM Cita c WHERE c.prestador.id = :idPrestador AND c.fecha = :fecha AND c.hora = :hora AND c.id <> :idCita")
    Long contarCitasPorPrestadorFechaHoraExceptoId(Long idCita, Long idPrestador, LocalDate fecha, LocalTime hora);

    // Este método es necesario si una Reseña se busca a través de su Cita
    Optional<Cita> findByResena_Id(Long resenaId);
}
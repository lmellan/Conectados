package com.conectados.conect.cita.repositories;

import com.conectados.conect.cita.entities.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {
    List<Cita> findByIdBuscador(Long idBuscador);
    List<Cita> findByIdPrestador(Long idPrestador);
}

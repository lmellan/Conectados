package com.conectados.conect.servicio.repositories;

import com.conectados.conect.cita.entities.Cita;
import com.conectados.conect.servicio.entities.Resena;
import com.conectados.conect.servicio.entities.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ResenaRepository extends JpaRepository<Resena, Long> {
    List<Resena> findByServicio(Servicio servicio);
    Optional<Resena> findByCita(Cita cita);
}


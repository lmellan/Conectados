package com.conectados.conect.servicio.repositories;

import com.conectados.conect.servicio.entities.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    List<Servicio> findByCategoria(String categoria);
    List<Servicio> findByPrestador_Id(Long prestadorId);

}
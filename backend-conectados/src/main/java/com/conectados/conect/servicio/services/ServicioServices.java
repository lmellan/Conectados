package com.conectados.conect.servicio.services;

import com.conectados.conect.servicio.entities.Dto.ServicioDto;
import com.conectados.conect.servicio.entities.Servicio;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ServicioServices {
    Servicio crearServicio(Servicio servicio);
    Servicio obtenerServicioPorId(Long id);
    List<ServicioDto> obtenerTodosLosServicios();
    List<Servicio> obtenerServiciosPorCategoria(String categoria);
    Servicio actualizarServicio(Long id, Servicio servicio);
    void eliminarServicio(Long id);
    List<Servicio> obtenerServiciosPorPrestadorId(Long prestadorId);
    List<Servicio> obtenerServiciosOrdenados(String sortBy);


}

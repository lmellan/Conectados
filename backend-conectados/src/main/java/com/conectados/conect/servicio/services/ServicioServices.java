package com.conectados.conect.servicio.services;

import com.conectados.conect.servicio.entities.Dto.ServicioDto;
import com.conectados.conect.servicio.entities.Servicio;
import java.util.List;
import java.util.Optional;

/**
 * Interfaz para la capa de servicio de la entidad Servicio.
 * Define el contrato para las operaciones de negocio relacionadas con los servicios.
 * Utiliza DTOs para la entrada de datos (creación/actualización) para desacoplar
 * la lógica de negocio de la representación web.
 */
public interface ServicioServices {

    /**
     * Crea un nuevo servicio a partir de los datos de un DTO.
     * @param servicioDto Objeto con los datos para el nuevo servicio.
     * @return La entidad Servicio recién creada y guardada.
     */
    Servicio crearServicio(ServicioDto servicioDto);

    /**
     * Busca un servicio por su ID.
     * @param id El ID del servicio a buscar.
     * @return un Optional que contiene la entidad Servicio si se encuentra, o un Optional vacío si no.
     */
    Optional<Servicio> obtenerServicioPorId(Long id);

    /**
     * Devuelve una lista de todos los servicios disponibles.
     * @return Una lista de entidades Servicio.
     */
    List<Servicio> obtenerTodosLosServicios();

    /**
     * Busca servicios por una categoría específica.
     * @param categoria La categoría por la cual filtrar.
     * @return Una lista de entidades Servicio que pertenecen a esa categoría.
     */
    List<Servicio> obtenerServiciosPorCategoria(String categoria);
    
    /**
     * Actualiza un servicio existente usando datos de un DTO.
     * @param id El ID del servicio a actualizar.
     * @param servicioDto Objeto con los nuevos datos para el servicio.
     * @return La entidad Servicio actualizada.
     */
    Servicio actualizarServicio(Long id, ServicioDto servicioDto);

    /**
     * Elimina un servicio por su ID.
     * @param id El ID del servicio a eliminar.
     */
    void eliminarServicio(Long id);
    
    /**
     * Obtiene todos los servicios ofrecidos por un prestador específico.
     * @param prestadorId El ID del usuario prestador.
     * @return Una lista de entidades Servicio ofrecidas por el prestador.
     */
    // MODIFICADO: El nombre ahora describe mejor la acción de negocio.
    List<Servicio> obtenerServiciosPorPrestador(Long prestadorId);
}
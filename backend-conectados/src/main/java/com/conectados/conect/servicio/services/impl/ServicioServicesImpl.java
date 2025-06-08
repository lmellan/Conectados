package com.conectados.conect.servicio.services.impl;

import com.conectados.conect.servicio.entities.Dto.ServicioDto;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.servicio.repositories.ServicioRepository;
import com.conectados.conect.servicio.services.ServicioServices;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioServicesImpl implements ServicioServices {

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public Servicio crearServicio(ServicioDto servicioDto) {
        // 1. Buscamos la entidad completa del Prestador usando el ID que viene en el DTO.
        Usuario prestador = usuarioRepository.findById(servicioDto.getPrestadorId())
                .orElseThrow(() -> new RuntimeException("Error: Prestador con ID " + servicioDto.getPrestadorId() + " no encontrado."));

        // 2. Creamos la nueva entidad de Servicio y copiamos los datos del DTO.
        Servicio nuevoServicio = new Servicio();
        nuevoServicio.setNombre(servicioDto.getNombre());
        nuevoServicio.setDescripcion(servicioDto.getDescripcion());
        nuevoServicio.setPrecio(servicioDto.getPrecio());
        nuevoServicio.setFoto(servicioDto.getFoto());
        nuevoServicio.setZonaAtencion(servicioDto.getZonaAtencion());
        nuevoServicio.setCategoria(servicioDto.getCategoria());

        // 3. Asociamos la entidad completa del Prestador con el nuevo servicio.
        nuevoServicio.setPrestador(prestador);

        // 4. Guardamos el nuevo servicio, ahora completo y válido.
        return servicioRepository.save(nuevoServicio);
    }

    @Override
    public Optional<Servicio> obtenerServicioPorId(Long id) {
        return servicioRepository.findById(id);
    }

    @Override
    public List<Servicio> obtenerTodosLosServicios() {
        return servicioRepository.findAll();
    }

    @Override
    public List<Servicio> obtenerServiciosPorCategoria(String categoria) {
        return servicioRepository.findByCategoria(categoria);
    }

    @Override
    public Servicio actualizarServicio(Long id, ServicioDto servicioDto) {
        return servicioRepository.findById(id).map(servicioExistente -> {
            servicioExistente.setNombre(servicioDto.getNombre());
            servicioExistente.setDescripcion(servicioDto.getDescripcion());
            servicioExistente.setPrecio(servicioDto.getPrecio());
            servicioExistente.setFoto(servicioDto.getFoto());
            servicioExistente.setZonaAtencion(servicioDto.getZonaAtencion());
            servicioExistente.setCategoria(servicioDto.getCategoria());
            return servicioRepository.save(servicioExistente);
        }).orElse(null);
    }

    @Override
    public void eliminarServicio(Long id) {
        servicioRepository.deleteById(id);
    }

    // MODIFICADO: Se implementa el método con el nombre correcto de la interfaz.
    @Override
    public List<Servicio> obtenerServiciosPorPrestador(Long prestadorId) {
        // La lógica interna llama al método del repositorio, que puede tener un nombre de convención JPA.
        // Asegúrate que tu ServicioRepository tenga un método findByPrestador_Id(Long prestadorId)
        return servicioRepository.findByPrestador_Id(prestadorId);
    }
}
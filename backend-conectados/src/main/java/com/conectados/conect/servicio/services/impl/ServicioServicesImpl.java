package com.conectados.conect.servicio.services.impl;

import com.conectados.conect.servicio.entities.Dto.ServicioDto;
import com.conectados.conect.servicio.ServicioConstantes;
import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.servicio.repositories.ServicioRepository;
import com.conectados.conect.servicio.services.ServicioServices;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioServicesImpl implements ServicioServices {

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;


    @Override
    public Servicio crearServicio(Servicio servicio) {
        if (servicio.getPrestador() != null && servicio.getPrestador().getId() != null) {
            Usuario prestadorCompleto = usuarioRepository.findById(servicio.getPrestador().getId()).orElse(null);
            if (prestadorCompleto == null) {
                throw new RuntimeException("Prestador no encontrado con ID: " + servicio.getPrestador().getId());
            }
            servicio.setPrestador(prestadorCompleto);
        }
        if (!ServicioConstantes.CATEGORIAS_VALIDAS.contains(servicio.getCategoria())) {
            throw new IllegalArgumentException("Categoría no válida. Las opciones disponibles son: " + ServicioConstantes.CATEGORIAS_VALIDAS);
        }

        return servicioRepository.save(servicio);
    }



    @Override
    public Servicio obtenerServicioPorId(Long id) {
        return servicioRepository.findById(id).orElse(null);
    }

    @Override
    public List<ServicioDto> obtenerTodosLosServicios() {
        List<Servicio> servicios = servicioRepository.findAll();
        return ServicioDto.fromEntityList(servicios);
    }

    @Override
    public List<Servicio> obtenerServiciosPorCategoria(String categoria) {
        return servicioRepository.findByCategoria(categoria);
    }

    @Override
    public Servicio actualizarServicio(Long id, Servicio servicio) {
        Optional<Servicio> servicioExistente = servicioRepository.findById(id);
        if (servicioExistente.isPresent()) {
            Servicio s = servicioExistente.get();
            s.setNombre(servicio.getNombre());
            s.setPrecio(servicio.getPrecio());
            s.setZonaAtencion(servicio.getZonaAtencion());
            s.setCategoria(servicio.getCategoria());
            s.setFoto(servicio.getFoto());
            s.setDescripcion(servicio.getDescripcion());
            return servicioRepository.save(s);
        }
        if (!ServicioConstantes.CATEGORIAS_VALIDAS.contains(servicio.getCategoria())) {
            throw new IllegalArgumentException("Categoría no válida. Las opciones disponibles son: " + ServicioConstantes.CATEGORIAS_VALIDAS);
}

        return null;
    }

    @Override
    public void eliminarServicio(Long id) {
        servicioRepository.deleteById(id
        );
    }

    @Override
    public List<Servicio> obtenerServiciosPorPrestadorId(Long prestadorId) {
        return servicioRepository.findByPrestador_Id(prestadorId);
    }

     @Override
    public List<Servicio> obtenerServiciosOrdenados(String sortBy) {
        return servicioRepository.findAll(Sort.by(sortBy));
    }

}

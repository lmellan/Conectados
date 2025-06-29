package com.conectados.conect.servicio.services.impl;

import com.conectados.conect.servicio.entities.Servicio;
import com.conectados.conect.servicio.repositories.ServicioRepository;
import com.conectados.conect.servicio.services.ServicioServices;
import com.conectados.conect.user.model.Usuario;
import com.conectados.conect.user.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.conectados.conect.user.model.Usuario;



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

        return servicioRepository.save(servicio);
    }


    @Override
    public Servicio actualizarServicio(Long id, Servicio servicio) {
        Optional<Servicio> servicioExistente = servicioRepository.findById(id);
        if (servicioExistente.isPresent()) {
            Servicio s = servicioExistente.get();

            // Verifica si el prestador tiene el rol adecuado
            Usuario prestador = s.getPrestador();
            if (prestador != null && !prestador.getRolActivo().equals("PRESTADOR")) {
                throw new RuntimeException("El prestador no tiene el rol adecuado.");
            }

            s.setNombre(servicio.getNombre());
            s.setPrecio(servicio.getPrecio());
            s.setZonaAtencion(servicio.getZonaAtencion());
            s.setCategoria(servicio.getCategoria());
            s.setFoto(servicio.getFoto());
            s.setDescripcion(servicio.getDescripcion());
            return servicioRepository.save(s);
        }

        return null;
    }

    @Override
    public Servicio obtenerServicioPorId(Long id) {
        return servicioRepository.findById(id).orElse(null);
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
    public void eliminarServicio(Long id) {
        servicioRepository.deleteById(id
        );
    }

    @Override
    public List<Servicio> obtenerServiciosPorPrestadorId(Long prestadorId) {
        return servicioRepository.findByPrestador_Id(prestadorId);
    }


}
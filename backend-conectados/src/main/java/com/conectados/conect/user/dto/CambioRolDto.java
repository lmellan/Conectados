package com.conectados.conect.user.dto;

import com.conectados.conect.user.model.Rol;

public class CambioRolDto {
    private Rol nuevoRol;

    public Rol getNuevoRol() {
        return nuevoRol;
    }

    public void setNuevoRol(Rol nuevoRol) {
        this.nuevoRol = nuevoRol;
    }
}

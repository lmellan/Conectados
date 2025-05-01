package com.conectados.conect.user.dto;

public class LoginDTO {
    private String correo;
    private String contraseña;

    // Getters y setters
    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContraseña() {
        return contraseña;
    }
    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }
}

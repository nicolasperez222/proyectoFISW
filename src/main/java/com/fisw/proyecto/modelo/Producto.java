package com.fisw.proyecto.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Producto {

    @Id
    @GeneratedValue
    Integer id;

    String nombre;
    Double precioCosto;
    Double precioVenta;
}

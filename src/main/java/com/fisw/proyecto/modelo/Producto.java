package com.fisw.proyecto.modelo;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;
    private Double precioCosto;
    private Double precioVenta;
    
    @ManyToOne
    private Categoria categoria;

    @ManyToMany(mappedBy = "subproductos")
    private List<ProductoCompuesto> productosCompuestos = new ArrayList();;
    
}

package com.fisw.proyecto.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "subproducto")
    private List<ProductoCompuestoSubproducto> productosCompuestos = new ArrayList<>();
}


package com.fisw.proyecto.modelo;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ProductoCompuestoSubproducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private ProductoCompuesto productoCompuesto;

    @ManyToOne
    private Producto subproducto;

    private int cantidad;
}


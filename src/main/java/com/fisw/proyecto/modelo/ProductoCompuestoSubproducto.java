package com.fisw.proyecto.modelo;

import com.fasterxml.jackson.annotation.JsonBackReference; 

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
public class ProductoCompuestoSubproducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JsonBackReference
    @ToString.Exclude
    private ProductoCompuesto productoCompuesto;

    @ManyToOne
    private Producto subproducto;

    private int cantidad;
}

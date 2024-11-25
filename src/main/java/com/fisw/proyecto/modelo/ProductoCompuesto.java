package com.fisw.proyecto.modelo;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
public class ProductoCompuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;
    private double precioBase;

    @ManyToOne
    private Categoria categoria;


    @OneToMany(mappedBy = "productoCompuesto", cascade = CascadeType.ALL)
    @JsonManagedReference
    @ToString.Exclude
    private List<ProductoCompuestoSubproducto> subproductos = new ArrayList<>();

    @OneToMany(mappedBy = "productoCompuesto")
    @ToString.Exclude
    private List<PedidoProductoCompuesto> pedidosProductosCompuestos = new ArrayList<>();

}

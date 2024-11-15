package com.fisw.proyecto.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

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
    private List<ProductoCompuestoSubproducto> subproductos = new ArrayList<>();
}



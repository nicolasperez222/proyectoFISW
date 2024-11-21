package com.fisw.proyecto.modelo;

import jakarta.persistence.*;
import lombok.Data;
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

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @OneToMany(mappedBy = "productoCompuesto", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ProductoCompuestoSubproducto> subproductos = new ArrayList<>();
}

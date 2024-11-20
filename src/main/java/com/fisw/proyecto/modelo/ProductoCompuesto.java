package com.fisw.proyecto.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference; // Agregar para evitar recursión en ProductoCompuesto

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

    // Evitar la serialización recursiva de subproductos
    @OneToMany(mappedBy = "productoCompuesto", cascade = CascadeType.ALL)
    @JsonManagedReference // Esto marca la relación en el lado de "ProductoCompuesto"
    private List<ProductoCompuestoSubproducto> subproductos = new ArrayList<>();
}

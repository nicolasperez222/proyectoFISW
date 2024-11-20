package com.fisw.proyecto.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore; // Agregar para evitar recursión en Producto

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
    @JoinColumn(name = "categoria_id", nullable = true)
    private Categoria categoria;

    // Evitar que se serialice la lista de productos compuestos (para prevenir recursión infinita)
    @OneToMany(mappedBy = "subproducto")
    @JsonIgnore // Esto previene la serialización del lado inverso
    private List<ProductoCompuestoSubproducto> productosCompuestos = new ArrayList<>();
}

package com.fisw.proyecto.modelo;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PedidoProductoCompuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    @JsonBackReference
    private Pedido pedido;


    @ManyToOne
    @JoinColumn(name = "producto_compuesto_id", nullable = false)
    private ProductoCompuesto productoCompuesto;

    private int cantidad;

    public PedidoProductoCompuesto() {}

    public PedidoProductoCompuesto(Pedido pedido, ProductoCompuesto productoCompuesto, int cantidad) {
        this.pedido = pedido;
        this.productoCompuesto = productoCompuesto;
        this.cantidad = cantidad;
    }
}

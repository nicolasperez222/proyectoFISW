package com.fisw.proyecto.modelo;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PedidoProductoCompuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
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

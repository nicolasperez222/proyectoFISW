package com.fisw.proyecto.modelo;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private int numeroMesa;
    private Date fechaCreacion;
    private String estado;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PedidoProducto> productos;
    
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<PedidoProductoCompuesto> productosCompuestos;
    

    public Pedido() {}

    public Pedido(int numeroMesa, Date fechaCreacion, String estado,
                  List<PedidoProducto> productos, List<PedidoProductoCompuesto> productosCompuestos) {
        this.numeroMesa = numeroMesa;
        this.fechaCreacion = fechaCreacion;
        this.estado = estado;
        this.productos = productos;
        this.productosCompuestos = productosCompuestos;
    }

    public void agregarProducto(Producto producto, int cantidad) {
        PedidoProducto pedidoProducto = new PedidoProducto(this, producto, cantidad);
        this.productos.add(pedidoProducto);
    }

    public void agregarProductoCompuesto(ProductoCompuesto productoCompuesto, int cantidad) {
        PedidoProductoCompuesto pedidoProductoCompuesto = new PedidoProductoCompuesto(this, productoCompuesto, cantidad);
        this.productosCompuestos.add(pedidoProductoCompuesto);
    }

    public void cambiarEstado(String nuevoEstado) {
        this.estado = nuevoEstado;
    }
}

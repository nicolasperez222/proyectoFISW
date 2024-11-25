package com.fisw.proyecto.modelo;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Data
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer numeroMesa;
    private String estado;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private Date fechaCreacion;


    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PedidoProductoCompuesto> productosCompuestos = new ArrayList<>();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PedidoProducto> productos = new ArrayList<>();


    public void addPedidoProductoCompuesto(PedidoProductoCompuesto ppc) {
        ppc.setPedido(this); 
        this.productosCompuestos.add(ppc);
    }

    public void removePedidoProductoCompuesto(PedidoProductoCompuesto ppc) {
        ppc.setPedido(null); 
        this.productosCompuestos.remove(ppc);
    }
    public void addPedidoProducto(PedidoProducto pp) {
        pp.setPedido(this); 
        this.productos.add(pp);
    }

    public void removePedidoProducto(PedidoProducto pp) {
        pp.setPedido(null); 
        this.productos.remove(pp);
    }
}


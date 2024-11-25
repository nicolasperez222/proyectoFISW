package com.fisw.proyecto.modelo;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@Data
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer numeroMesa;
    private String estado;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaCreacion;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoProductoCompuesto> pedidoProductoCompuestos = new ArrayList<>();

    public void addPedidoProductoCompuesto(PedidoProductoCompuesto ppc) {
        ppc.setPedido(this); 
        this.pedidoProductoCompuestos.add(ppc);
    }

    public void removePedidoProductoCompuesto(PedidoProductoCompuesto ppc) {
        ppc.setPedido(null); 
        this.pedidoProductoCompuestos.remove(ppc);
    }
}


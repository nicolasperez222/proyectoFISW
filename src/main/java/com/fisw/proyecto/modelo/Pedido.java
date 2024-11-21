package com.fisw.proyecto.modelo;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.List;
import java.util.Date;

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
    private List<Producto> productos;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductoCompuesto> productosCompuestos;

    public Pedido() {}

    public Pedido(int numeroMesa, Date fechaCreacion, String estado,
        List<Producto> productos, List<ProductoCompuesto> productosCompuestos) {
        this.numeroMesa = numeroMesa;
        this.fechaCreacion = fechaCreacion;
        this.estado = estado;
        this.productos = productos;
        this.productosCompuestos = productosCompuestos;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getNumeroMesa() {
        return numeroMesa;
    }

    public void setNumeroMesa(int numeroMesa) {
        this.numeroMesa = numeroMesa;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<Producto> getProductos() {
        return productos;
    }

    public void setProductos(List<Producto> productos) {
        this.productos = productos;
    }

    public List<ProductoCompuesto> getProductosCompuestos() {
        return productosCompuestos;
    }

    public void setProductosCompuestos(List<ProductoCompuesto> productosCompuestos) {
        this.productosCompuestos = productosCompuestos;
    }

    public void agregarProducto(Producto producto) {
        this.productos.add(producto);
    }

    public void agregarProductoCompuesto(ProductoCompuesto productoCompuesto) {
        this.productosCompuestos.add(productoCompuesto);
    }

    public void cambiarEstado(String nuevoEstado) {
        this.estado = nuevoEstado;
    }
}

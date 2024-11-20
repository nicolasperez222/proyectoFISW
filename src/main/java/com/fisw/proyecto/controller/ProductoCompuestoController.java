package com.fisw.proyecto.controller;

import com.fisw.proyecto.modelo.Producto;
import com.fisw.proyecto.modelo.ProductoCompuesto;
import com.fisw.proyecto.modelo.ProductoCompuestoSubproducto;
import com.fisw.proyecto.repository.CategoriaRepository;
import com.fisw.proyecto.repository.ProductoCompuestoRepository;
import com.fisw.proyecto.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/producto-compuesto")
public class ProductoCompuestoController {

    @Autowired
    private ProductoCompuestoRepository productoCompuestoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoCompuesto crearProductoCompuesto(@RequestBody ProductoCompuesto productoCompuesto) {
   
        if (productoCompuesto.getCategoria() != null && productoCompuesto.getCategoria().getId() != null) {
            productoCompuesto.setCategoria(categoriaRepository.findById(productoCompuesto.getCategoria().getId()).orElse(null));
        }

        List<ProductoCompuestoSubproducto> subproductosConCantidad = new ArrayList<>();

        for (ProductoCompuestoSubproducto subproducto : productoCompuesto.getSubproductos()) {
            Producto producto = productoRepository.findById(subproducto.getSubproducto().getId()).orElse(null);
            if (producto != null) {
                if (subproducto.getCantidad() <= 0) {
                    throw new IllegalArgumentException("La cantidad del subproducto debe ser mayor que 0");
                }

                subproducto.setProductoCompuesto(productoCompuesto);
                subproducto.setSubproducto(producto);
                subproductosConCantidad.add(subproducto);
            } else {
                throw new IllegalArgumentException("Producto no encontrado con ID: " + subproducto.getSubproducto().getId());
            }
        }

        productoCompuesto.setSubproductos(subproductosConCantidad);

        return productoCompuestoRepository.save(productoCompuesto);
    }

    @GetMapping("/")
    public Iterable<ProductoCompuesto> getProductosCompuestos() {
        return productoCompuestoRepository.findAll();
    }
}


package com.fisw.proyecto.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.fisw.proyecto.modelo.Categoria;
import com.fisw.proyecto.modelo.ProductoCompuesto;
import com.fisw.proyecto.modelo.Producto;
import com.fisw.proyecto.modelo.ProductoCompuestoSubproducto;
import com.fisw.proyecto.repository.CategoriaRepository;
import com.fisw.proyecto.repository.ProductoCompuestoRepository;
import com.fisw.proyecto.repository.ProductoRepository;
import com.fisw.proyecto.repository.ProductoCompuestoSubproductoRepository;

import java.util.List;

@RestController
@RequestMapping("/producto-compuesto")
public class ProductoCompuestoController {

    private final ProductoCompuestoRepository productoCompuestoRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoCompuestoSubproductoRepository productoCompuestoSubproductoRepository;

    public ProductoCompuestoController(
        ProductoCompuestoRepository productoCompuestoRepository, 
        ProductoRepository productoRepository, 
        CategoriaRepository categoriaRepository,
        ProductoCompuestoSubproductoRepository productoCompuestoSubproductoRepository) {
        
        this.productoCompuestoRepository = productoCompuestoRepository;
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.productoCompuestoSubproductoRepository = productoCompuestoSubproductoRepository;
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoCompuesto crearProductoCompuesto(
            @RequestBody ProductoCompuesto productoCompuesto, 
            @RequestParam Integer categoriaId, 
            @RequestBody List<SubproductoCantidad> subproductos) {

        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        productoCompuesto.setCategoria(categoria);

        for (SubproductoCantidad subproductoCantidad : subproductos) {
            Producto subproducto = productoRepository.findById(subproductoCantidad.getSubproductoId())
                    .orElseThrow(() -> new RuntimeException("Subproducto con ID " + subproductoCantidad.getSubproductoId() + " no encontrado"));

            ProductoCompuestoSubproducto compuestoSubproducto = new ProductoCompuestoSubproducto();
            compuestoSubproducto.setProductoCompuesto(productoCompuesto);
            compuestoSubproducto.setSubproducto(subproducto);
            compuestoSubproducto.setCantidad(subproductoCantidad.getCantidad());

            productoCompuesto.getSubproductos().add(compuestoSubproducto);
            productoCompuestoSubproductoRepository.save(compuestoSubproducto);
        }

        return productoCompuestoRepository.save(productoCompuesto);
    }

    @GetMapping("/")
    public Iterable<ProductoCompuesto> getProductosCompuestos() {
        return productoCompuestoRepository.findAll();
    }

    public static class SubproductoCantidad {
        private Integer subproductoId;
        private int cantidad;

        public Integer getSubproductoId() {
            return subproductoId;
        }

        public void setSubproductoId(Integer subproductoId) {
            this.subproductoId = subproductoId;
        }

        public int getCantidad() {
            return cantidad;
        }

        public void setCantidad(int cantidad) {
            this.cantidad = cantidad;
        }
    }
}

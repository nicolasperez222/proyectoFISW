package com.fisw.proyecto.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;

import com.fisw.proyecto.modelo.Categoria;
import com.fisw.proyecto.modelo.ProductoCompuesto;
import com.fisw.proyecto.modelo.Producto;
import com.fisw.proyecto.repository.CategoriaRepository;
import com.fisw.proyecto.repository.ProductoCompuestoRepository;
import com.fisw.proyecto.repository.ProductoRepository;


@RestController
@RequestMapping("/producto-compuesto")
public class ProductoCompuestoController {

    private final ProductoCompuestoRepository productoCompuestoRepository;
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoCompuestoController(ProductoCompuestoRepository productoCompuestoRepository, ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoCompuestoRepository = productoCompuestoRepository;
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoCompuesto crearProductoCompuesto(@RequestBody ProductoCompuesto productoCompuesto, @RequestParam Integer categoriaId, @RequestParam Integer[] subproductoIds) {
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        productoCompuesto.setCategoria(categoria);

        for (Integer subproductoId : subproductoIds) {
            Producto subproducto = productoRepository.findById(subproductoId)
                    .orElseThrow(() -> new RuntimeException("Subproducto con ID " + subproductoId + " no encontrado"));
            productoCompuesto.getSubproductos().add(subproducto);
        }

        return productoCompuestoRepository.save(productoCompuesto);
    }

    @GetMapping("/")
    public Iterable<ProductoCompuesto> getProductosCompuestos() {
        return productoCompuestoRepository.findAll();
    }
}

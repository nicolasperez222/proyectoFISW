package com.fisw.proyecto.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fisw.proyecto.modelo.Categoria;
import com.fisw.proyecto.modelo.Producto;
import com.fisw.proyecto.repository.CategoriaRepository;
import com.fisw.proyecto.repository.ProductoRepository;

@RestController
@RequestMapping("/producto")
public class ProductoController {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    
    public ProductoController(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @PostMapping("/")
    public Producto crearProducto(@RequestBody Producto producto, @RequestParam(required = false) Integer categoriaId) {
        Categoria categoria = null;
        
        if (categoriaId != null) {
            categoria = categoriaRepository.findById(categoriaId)
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        }
        
        producto.setCategoria(categoria);
        return productoRepository.save(producto);
    }
    
    @GetMapping("/")
    public Iterable<Producto> getProductos() {
        return productoRepository.findAll();
    }
}

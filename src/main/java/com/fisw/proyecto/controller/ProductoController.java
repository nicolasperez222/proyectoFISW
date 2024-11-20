package com.fisw.proyecto.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.fisw.proyecto.modelo.Categoria;
import com.fisw.proyecto.modelo.Producto;
import com.fisw.proyecto.repository.CategoriaRepository;
import com.fisw.proyecto.repository.ProductoRepository;
import org.springframework.http.HttpStatus;

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

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscarProductos(@RequestParam(required = false) String filtro) {
        
        if (filtro == null || filtro.isEmpty()) {
            List<Producto> productos = productoRepository.findAll();
            return ResponseEntity.ok(productos);
        }

        List<Producto> productos = productoRepository.findByNombreContainingIgnoreCase(filtro);
        return ResponseEntity.ok(productos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarProducto(@PathVariable Integer id) {
        productoRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Producto actualizarCategoria(@PathVariable Integer id, @RequestBody Producto producto) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrada");
        }
        producto.setId(id);
        return productoRepository.save(producto);
    }
}

package com.fisw.proyecto.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import com.fisw.proyecto.modelo.ProductoCompuesto;
import com.fisw.proyecto.repository.ProductoCompuestoRepository;

@RestController
@RequestMapping("/producto-compuesto")
public class ProductoCompuestoController {
    private final ProductoCompuestoRepository productoCompuestoRepository;

    public ProductoCompuestoController(ProductoCompuestoRepository productoCompuestoRepository) {
        this.productoCompuestoRepository = productoCompuestoRepository;
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoCompuesto crearProducto(@RequestBody ProductoCompuesto producto) {
        return productoCompuestoRepository.save(producto);
    }
    
    
    @GetMapping("/")
    public Iterable<ProductoCompuesto> getProductos() {
        return productoCompuestoRepository.findAll();
    }
}

package com.fisw.proyecto.controller;

import com.fisw.proyecto.modelo.Categoria;
import com.fisw.proyecto.modelo.Producto;
import com.fisw.proyecto.modelo.ProductoCompuesto;
import com.fisw.proyecto.modelo.ProductoCompuestoSubproducto;
import com.fisw.proyecto.repository.CategoriaRepository;
import com.fisw.proyecto.repository.ProductoCompuestoRepository;
import com.fisw.proyecto.repository.ProductoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
        Logger logger = LoggerFactory.getLogger(ProductoCompuestoController.class);

        // Imprimir el JSON que se recibe en la solicitud
        logger.info("JSON recibido: {}", productoCompuesto);

        // Asociar la categoría al ProductoCompuesto
        if (productoCompuesto.getCategoria() != null && productoCompuesto.getCategoria().getId() != null) {
            productoCompuesto.setCategoria(categoriaRepository.findById(productoCompuesto.getCategoria().getId()).orElse(null));
        }

        // Crear una lista para guardar los subproductos procesados
        List<ProductoCompuestoSubproducto> subproductosConCantidad = new ArrayList<>();

        // Verificar y asociar los subproductos con la cantidad
        for (ProductoCompuestoSubproducto subproducto : productoCompuesto.getSubproductos()) {
            Producto producto = productoRepository.findById(subproducto.getSubproducto().getId()).orElse(null);
            if (producto != null) {

                // Verificar que la cantidad sea mayor que 0
                if (subproducto.getCantidad() <= 0) {
                    throw new IllegalArgumentException("La cantidad del subproducto debe ser mayor que 0");
                }

                // Asociar el subproducto al ProductoCompuesto
                subproducto.setProductoCompuesto(productoCompuesto);

                // Asociar el Producto con la cantidad al subproducto
                subproducto.setSubproducto(producto);

                // Añadir el subproducto con su cantidad a la lista
                subproductosConCantidad.add(subproducto);
            } else {
                throw new IllegalArgumentException("Producto no encontrado con ID: " + subproducto.getSubproducto().getId());
            }
        }

        // Asignar la lista de subproductos procesados al ProductoCompuesto
        productoCompuesto.setSubproductos(subproductosConCantidad);

        // Guardar el ProductoCompuesto y sus subproductos
        return productoCompuestoRepository.save(productoCompuesto);
    }

    // Obtener todos los productos compuestos
    @GetMapping("/")
    public Iterable<ProductoCompuesto> getProductosCompuestos() {
        return productoCompuestoRepository.findAll();
    }
}


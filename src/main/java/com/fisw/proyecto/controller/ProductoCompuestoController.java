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
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


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

    @GetMapping("/buscar")
    public ResponseEntity<List<ProductoCompuesto>> buscarProductos(@RequestParam(required = false) String filtro) {
        
        if (filtro == null || filtro.isEmpty()) {
            List<ProductoCompuesto> productos = productoCompuestoRepository.findAll();
            return ResponseEntity.ok(productos);
        }

        List<ProductoCompuesto> productos = productoCompuestoRepository.findByNombreContainingIgnoreCase(filtro);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoCompuesto> obtenerProductoCompuesto(@PathVariable Integer id) {
        Optional<ProductoCompuesto> producto = productoCompuestoRepository.findById(id);
        if (producto.isPresent()) {
            return ResponseEntity.ok(producto.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<ProductoCompuesto> actualizarProductoCompuesto(@PathVariable Integer id, @RequestBody ProductoCompuesto productoCompuesto) {
        Optional<ProductoCompuesto> productoExistente = productoCompuestoRepository.findById(id);
        if (!productoExistente.isPresent()) {
            return ResponseEntity.notFound().build(); 
        }
    
        ProductoCompuesto productoACtual = productoExistente.get();
    
        // Actualizar la categoría si se proporciona una categoría válida
        if (productoCompuesto.getCategoria() != null && productoCompuesto.getCategoria().getId() != null) {
            productoACtual.setCategoria(categoriaRepository.findById(productoCompuesto.getCategoria().getId()).orElse(null));
        }
    
        // Crear una nueva lista para los subproductos
        List<ProductoCompuestoSubproducto> subproductosConCantidad = new ArrayList<>();
    
        // Iterar sobre los subproductos recibidos y asignar las cantidades
        for (ProductoCompuestoSubproducto subproducto : productoCompuesto.getSubproductos()) {
            Producto producto = productoRepository.findById(subproducto.getSubproducto().getId()).orElse(null);
            if (producto != null) {
                if (subproducto.getCantidad() <= 0) {
                    return ResponseEntity.badRequest().body(null); // Validación de cantidad
                }
    
                subproducto.setProductoCompuesto(productoACtual);
                subproducto.setSubproducto(producto);
    
                // Verificar si el subproducto ya existe en la lista actual (por ID del subproducto)
                boolean subproductoExistente = false;
                for (ProductoCompuestoSubproducto actualSubproducto : productoACtual.getSubproductos()) {
                    if (actualSubproducto.getSubproducto().getId().equals(subproducto.getSubproducto().getId())) {
                        // Si existe, solo actualizamos la cantidad
                        actualSubproducto.setCantidad(subproducto.getCantidad());
                        subproductoExistente = true;
                        break;
                    }
                }
    
                // Si el subproducto no existe, lo agregamos a la lista
                if (!subproductoExistente) {
                    subproductosConCantidad.add(subproducto);
                }
            } else {
                return ResponseEntity.badRequest().body(null); // Producto no encontrado
            }
        }
    
        // Reemplazar la lista de subproductos del producto compuesto con la nueva lista
        productoACtual.setSubproductos(subproductosConCantidad);
    
        // Guardar el producto compuesto actualizado
        productoCompuestoRepository.save(productoACtual);
    
        return ResponseEntity.ok(productoACtual); // Devolver el producto compuesto actualizado
    }
    


}


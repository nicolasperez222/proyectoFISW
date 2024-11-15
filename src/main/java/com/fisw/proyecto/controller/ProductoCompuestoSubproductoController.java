package com.fisw.proyecto.controller;

import com.fisw.proyecto.modelo.ProductoCompuesto;
import com.fisw.proyecto.modelo.Producto;
import com.fisw.proyecto.modelo.ProductoCompuestoSubproducto;
import com.fisw.proyecto.repository.ProductoCompuestoRepository;
import com.fisw.proyecto.repository.ProductoRepository;
import com.fisw.proyecto.repository.ProductoCompuestoSubproductoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/producto-compuesto-subproducto")
public class ProductoCompuestoSubproductoController {

    private final ProductoCompuestoSubproductoRepository productoCompuestoSubproductoRepository;
    private final ProductoCompuestoRepository productoCompuestoRepository;
    private final ProductoRepository productoRepository;

    public ProductoCompuestoSubproductoController(
            ProductoCompuestoSubproductoRepository productoCompuestoSubproductoRepository,
            ProductoCompuestoRepository productoCompuestoRepository,
            ProductoRepository productoRepository) {
        this.productoCompuestoSubproductoRepository = productoCompuestoSubproductoRepository;
        this.productoCompuestoRepository = productoCompuestoRepository;
        this.productoRepository = productoRepository;
    }

    // Agregar un subproducto con cantidad a un producto compuesto
    @PostMapping("/agregar")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoCompuestoSubproducto agregarSubproducto(
            @RequestParam Integer productoCompuestoId,
            @RequestParam Integer subproductoId,
            @RequestParam int cantidad) {

        ProductoCompuesto productoCompuesto = productoCompuestoRepository.findById(productoCompuestoId)
                .orElseThrow(() -> new RuntimeException("Producto compuesto no encontrado"));
        Producto subproducto = productoRepository.findById(subproductoId)
                .orElseThrow(() -> new RuntimeException("Subproducto no encontrado"));

        ProductoCompuestoSubproducto nuevoSubproducto = new ProductoCompuestoSubproducto();
        nuevoSubproducto.setProductoCompuesto(productoCompuesto);
        nuevoSubproducto.setSubproducto(subproducto);
        nuevoSubproducto.setCantidad(cantidad);

        return productoCompuestoSubproductoRepository.save(nuevoSubproducto);
    }

    // Actualizar la cantidad de un subproducto en un producto compuesto
    @PutMapping("/actualizar/{id}")
    public ProductoCompuestoSubproducto actualizarCantidad(
            @PathVariable Integer id,
            @RequestParam int cantidad) {

        ProductoCompuestoSubproducto subproductoExistente = productoCompuestoSubproductoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto compuesto subproducto no encontrado"));

        subproductoExistente.setCantidad(cantidad);
        return productoCompuestoSubproductoRepository.save(subproductoExistente);
    }

    // Eliminar un subproducto de un producto compuesto
    @DeleteMapping("/eliminar/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarSubproducto(@PathVariable Integer id) {
        ProductoCompuestoSubproducto subproductoExistente = productoCompuestoSubproductoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto compuesto subproducto no encontrado"));
        productoCompuestoSubproductoRepository.delete(subproductoExistente);
    }

    // Obtener todos los subproductos de un producto compuesto específico
    @GetMapping("/listar/{productoCompuestoId}")
    public List<ProductoCompuestoSubproducto> listarSubproductos(@PathVariable Integer productoCompuestoId) {
        ProductoCompuesto productoCompuesto = productoCompuestoRepository.findById(productoCompuestoId)
                .orElseThrow(() -> new RuntimeException("Producto compuesto no encontrado"));
        return productoCompuesto.getSubproductos();
    }
}

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

@RestController
@RequestMapping("/producto-compuesto")
public class ProductoCompuestoController {
    @Autowired
    private  ProductoCompuestoRepository productoCompuestoRepository;
    @Autowired
    private  CategoriaRepository categoriaRepository;
    @Autowired
    private  ProductoRepository productoRepository;

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> crearProductoCompuesto(@RequestBody ProductoCompuesto productoCompuestoInput) {
        try {
            // Crear el objeto ProductoCompuesto
            ProductoCompuesto productoCompuesto = new ProductoCompuesto();
            productoCompuesto.setNombre(productoCompuestoInput.getNombre());
            productoCompuesto.setPrecioBase(productoCompuestoInput.getPrecioBase());

            // Asignar la categoría si se especifica
            if (productoCompuestoInput.getCategoria() != null && productoCompuestoInput.getCategoria().getId() != null) {
                Categoria categoria = categoriaRepository.findById(productoCompuestoInput.getCategoria().getId())
                        .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " 
                                                                + productoCompuestoInput.getCategoria().getId()));
                productoCompuesto.setCategoria(categoria);
            }

            // Crear y asignar los subproductos
            List<ProductoCompuestoSubproducto> subproductos = new ArrayList<>();
            for (ProductoCompuestoSubproducto pcsInput : productoCompuestoInput.getSubproductos()) {
                if (pcsInput.getSubproducto() != null && pcsInput.getSubproducto().getId() != null) {
                    Producto subproducto = productoRepository.findById(pcsInput.getSubproducto().getId())
                            .orElseThrow(() -> new RuntimeException("Subproducto no encontrado con ID: " 
                                                                    + pcsInput.getSubproducto().getId()));

                    ProductoCompuestoSubproducto pcs = new ProductoCompuestoSubproducto();
                    pcs.setProductoCompuesto(productoCompuesto); 
                    pcs.setSubproducto(subproducto);
                    pcs.setCantidad(pcsInput.getCantidad());
                    subproductos.add(pcs);
                }
            }

            productoCompuesto.setSubproductos(subproductos);

            // Guardar el ProductoCompuesto y sus subproductos
            ProductoCompuesto productoCompuestoGuardado = productoCompuestoRepository.save(productoCompuesto);

            // Guardar los subproductos asociados
            productoCompuestoGuardado.setSubproductos(subproductos);
            productoCompuestoRepository.save(productoCompuestoGuardado);

            return ResponseEntity.ok(productoCompuestoGuardado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el ProductoComponente: " + e.getMessage());
        }
    }

    // Obtener todaos los productos compuestos
    @GetMapping("/")
    public Iterable<ProductoCompuesto> getProductosCompuestos() {
        return productoCompuestoRepository.findAll();
    }

}

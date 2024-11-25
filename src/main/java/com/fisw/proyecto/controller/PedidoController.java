package com.fisw.proyecto.controller;

import com.fisw.proyecto.modelo.Pedido;
import com.fisw.proyecto.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    // Crear un nuevo pedido
    @PostMapping("/crear")
    public ResponseEntity<String> crearPedido(@RequestBody Pedido pedido) {
        try {
            System.out.println("Pedido recibido: " + pedido);
           
            // Asociar el pedido a cada producto
            if (pedido.getProductos() != null) {
                pedido.getProductos().forEach(pp -> pp.setPedido(pedido));
            }
            // Asociar el pedido a cada producto compuesto
            if (pedido.getProductosCompuestos() != null) {
                pedido.getProductosCompuestos().forEach(ppc -> ppc.setPedido(pedido));
            }

            pedidoRepository.save(pedido);
            return ResponseEntity.ok("Pedido creado con éxito");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al crear el pedido");
        }
    }

    // Obtener todos los pedidos
    @GetMapping("/")
    public ResponseEntity<List<Pedido>> obtenerTodosLosPedidos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }

    // Obtener un pedido por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedidoPorId(@PathVariable Integer id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        return pedido.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                     .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Actualizar un pedido existente
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> actualizarPedido(@PathVariable Integer id, @RequestBody Pedido pedido) {
        Optional<Pedido> pedidoExistente = pedidoRepository.findById(id);
        if (pedidoExistente.isPresent()) {
            pedido.setId(id); // Asegúrate de mantener el ID del pedido existente
            Pedido pedidoActualizado = pedidoRepository.save(pedido);
            return new ResponseEntity<>(pedidoActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un pedido por su ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Integer id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (pedido.isPresent()) {
            pedidoRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

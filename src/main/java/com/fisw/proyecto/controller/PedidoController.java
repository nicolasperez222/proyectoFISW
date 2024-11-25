package com.fisw.proyecto.controller;

import com.fisw.proyecto.modelo.Pedido;
import com.fisw.proyecto.modelo.PedidoProducto;
import com.fisw.proyecto.modelo.PedidoProductoCompuesto;
import com.fisw.proyecto.modelo.Producto;
import com.fisw.proyecto.modelo.ProductoCompuesto;
import com.fisw.proyecto.modelo.ProductoCompuestoSubproducto;
import com.fisw.proyecto.repository.PedidoRepository;
import com.fisw.proyecto.repository.ProductoCompuestoRepository;
import com.fisw.proyecto.repository.ProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private ProductoCompuestoRepository productoCompuestoRepository;

    // Crear un nuevo pedido
    @PostMapping("/crear")
    public ResponseEntity<String> crearPedido(@RequestBody Map<String, Object> pedidoData) {
        try {
            // Crear el objeto Pedido
            System.out.print(pedidoData);
            Pedido pedido = new Pedido();
            pedido.setNumeroMesa((Integer) pedidoData.get("numeroMesa"));
            pedido.setFechaCreacion(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm").parse((String) pedidoData.get("fechaCreacion")));
            pedido.setEstado((String) pedidoData.get("estado"));

            // Construir lista de productos
            List<Map<String, Object>> productos = (List<Map<String, Object>>) pedidoData.get("productos");
            if (productos != null) {
                for (Map<String, Object> prodData : productos) {
                    Integer idProducto = (Integer) prodData.get("id");
                    Integer cantidad = (Integer) prodData.get("cantidad");

                    Producto producto = productoRepository.findById(idProducto)
                            .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + idProducto));
                    PedidoProducto pedidoProducto = new PedidoProducto(pedido, producto, cantidad);

                    pedido.addPedidoProducto(pedidoProducto);
                }
            }

            // Construir lista de productos compuestos
            List<Map<String, Object>> productosCompuestos = (List<Map<String, Object>>) pedidoData.get("productosCompuestos");
            if (productosCompuestos != null) {
                for (Map<String, Object> compData : productosCompuestos) {
                    // Extraer el objeto productoCompuesto
                    Map<String, Object> productoCompuestoData = (Map<String, Object>) compData.get("productoCompuesto");
                    if (productoCompuestoData == null || productoCompuestoData.get("id") == null) {
                        throw new RuntimeException("Faltan datos del producto compuesto.");
                    }

                    Integer idCompuesto = (Integer) productoCompuestoData.get("id");
                    Integer cantidadCompuesto = (Integer) compData.get("cantidad");

                    // Buscar el producto compuesto en la base de datos
                    ProductoCompuesto productoCompuesto = productoCompuestoRepository.findById(idCompuesto)
                            .orElseThrow(() -> new RuntimeException("Producto compuesto no encontrado: " + idCompuesto));

                    PedidoProductoCompuesto pedidoProductoCompuesto = new PedidoProductoCompuesto(pedido, productoCompuesto, cantidadCompuesto);

                    // Procesar subproductos dentro del producto compuesto
                    List<Map<String, Object>> subproductos = (List<Map<String, Object>>) productoCompuestoData.get("subproductos");
                    if (subproductos != null) {
                        for (Map<String, Object> subData : subproductos) {
                            Map<String, Object> subproductoData = (Map<String, Object>) subData.get("subproducto");
                            if (subproductoData == null || subproductoData.get("id") == null) {
                                throw new RuntimeException("Faltan datos del subproducto.");
                            }

                            Integer idSubproducto = (Integer) subproductoData.get("id");
                            Integer cantidadSub = (Integer) subData.get("cantidad");

                            Producto subproducto = productoRepository.findById(idSubproducto)
                                    .orElseThrow(() -> new RuntimeException("Subproducto no encontrado: " + idSubproducto));

                            ProductoCompuestoSubproducto pcs = new ProductoCompuestoSubproducto(productoCompuesto, subproducto, cantidadSub);

                            productoCompuesto.addSubproducto(pcs);
                        }
                    }

                    pedido.addPedidoProductoCompuesto(pedidoProductoCompuesto);
                }
            }

            pedidoRepository.save(pedido);

            return ResponseEntity.ok("Pedido creado con éxito");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al crear el pedido: " + e.getMessage());
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
            pedido.setId(id);
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

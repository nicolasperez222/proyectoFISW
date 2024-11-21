package com.fisw.proyecto.controller;

import org.springframework.stereotype.Controller; 
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class PantallasController {
    
    @GetMapping("/")
    public String inicio() {
        return "index";
    }

    @GetMapping("producto/crear")
    public String crearProducto() {
        return "productos";
    }
    @GetMapping("categoria/crear")
    public String crearCategoria() {
        return "categoria";
    }
    @GetMapping("pedido/crear")
    public String crearPedido() {
        return "pedido";
    }
}

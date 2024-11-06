package com.fisw.proyecto.controller;

import org.springframework.stereotype.Controller; 
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class Pantallas {


    @GetMapping("/")
    public String hola() {
        return "index";
    }
    @GetMapping("producto/crear")
    public String crearProducto() {
        return "productos";
    }


}


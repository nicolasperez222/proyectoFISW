package com.fisw.proyecto.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fisw.proyecto.repository.ProductoRepository;
@RequestMapping("/")
@RestController
public class control {
    @GetMapping("/")
    public String getMessage()  {
        return "Hola Mundo !!";
    }
    @GetMapping("/hola")
    public String adios(){
        return "Adios!!";
    }
    private final ProductoRepository tareasRepository;

    public control(ProductoRepository tareasRepository) {
        this.tareasRepository = tareasRepository;
    } 
}

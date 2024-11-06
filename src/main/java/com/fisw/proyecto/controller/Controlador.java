package com.fisw.proyecto.controller;

import org.springframework.stereotype.Controller;  // Cambié RestController a Controller
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import com.fisw.proyecto.repository.ProductoRepository;

@Controller  // Usamos @Controller para manejar vistas
@RequestMapping("/")
public class Controlador {

    private final ProductoRepository productoRepository;

    // Constructor para la inyección de dependencia
    public Controlador(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping("/")
    public String hola() {
        // Devolverá la vista "index.html" ubicada en src/main/resources/templates/
        return "index";  // Spring buscará un archivo llamado index.html
    }

    @GetMapping("/hola")
    public String adios() {
        return "Adiós!!";  // Este es solo un mensaje en texto
    }
}

package com.fisw.proyecto.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import com.fisw.proyecto.modelo.Categoria;
import com.fisw.proyecto.repository.CategoriaRepository;

@RestController
@RequestMapping("/categoria")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;
    
    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public Categoria crearProducto(@RequestBody Categoria producto) {
        return categoriaRepository.save(producto);
    }
    
    @GetMapping("/")
    public Iterable<Categoria> getProductos() {
        return categoriaRepository.findAll();
    }

}

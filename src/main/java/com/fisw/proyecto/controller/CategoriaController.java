package com.fisw.proyecto.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    // Crear categoría
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public Categoria crearCategoria(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }
    
    // Obtener todas las categorías
    @GetMapping("/")
    public Iterable<Categoria> getCategorias() {
        return categoriaRepository.findAll();
    }

    // Eliminar categoría por ID
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarCategoria(@PathVariable Integer id) {
        categoriaRepository.deleteById(id);
    }

    // Actualizar categoría
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Categoria actualizarCategoria(@PathVariable Integer id, @RequestBody Categoria categoria) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada");
        }
        categoria.setId(id); // Asegura que se actualice la categoría con el ID correcto
        return categoriaRepository.save(categoria);
    }
}

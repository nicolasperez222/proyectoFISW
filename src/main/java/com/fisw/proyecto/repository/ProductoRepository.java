package com.fisw.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fisw.proyecto.modelo.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

}


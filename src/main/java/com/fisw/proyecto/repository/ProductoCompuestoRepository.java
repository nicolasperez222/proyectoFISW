package com.fisw.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fisw.proyecto.modelo.ProductoCompuesto;

@Repository
public interface ProductoCompuestoRepository extends JpaRepository<ProductoCompuesto, Integer> {

}


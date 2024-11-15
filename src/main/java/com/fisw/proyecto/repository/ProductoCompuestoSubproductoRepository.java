package com.fisw.proyecto.repository;

import com.fisw.proyecto.modelo.ProductoCompuestoSubproducto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoCompuestoSubproductoRepository extends JpaRepository<ProductoCompuestoSubproducto, Integer> {
}

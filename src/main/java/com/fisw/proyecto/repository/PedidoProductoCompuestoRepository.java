package com.fisw.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fisw.proyecto.modelo.PedidoProductoCompuesto;

@Repository
public interface PedidoProductoCompuestoRepository extends JpaRepository<PedidoProductoCompuesto, Integer>{

}

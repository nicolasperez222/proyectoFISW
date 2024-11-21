package com.fisw.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fisw.proyecto.modelo.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

}

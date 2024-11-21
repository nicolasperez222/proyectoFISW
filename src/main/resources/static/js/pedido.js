document.addEventListener("DOMContentLoaded", function () {
    // Variables globales
    const productosPedidoList = document.getElementById("productosPedido");
    const productosInput = document.getElementById("producto");
    const agregarProductoBtn = document.getElementById("agregarProductoBtn");
    const confirmacionSimpleModal = document.getElementById("confirmacionSimple");
    const confirmacionCompuestoModal = document.getElementById("confirmacionCompuesto");
    const cantidadSimpleInput = document.getElementById("cantidadSimple");
    const subproductosList = document.getElementById("subproductosList");

    let productos = []; // Para almacenar los productos disponibles
    let productoSeleccionado = null;

    // Establecer fecha por defecto
    const fechaInput = document.getElementById("fecha");
    const fechaActual = new Date();
    fechaInput.value = fechaActual.toISOString().slice(0, 16);

    // Simular API de productos (para pruebas)
    productos = [
        { id: 1, nombre: "Pizza", subproductos: [{ nombre: "Queso" }, { nombre: "Pepperoni" }] },
        { id: 2, nombre: "Hamburguesa", subproductos: [] },
        { id: 3, nombre: "Pasta", subproductos: [{ nombre: "Salsa Alfredo" }, { nombre: "Pollo" }] },
    ];
    actualizarDatalist();

    // Actualiza el datalist con los productos disponibles
    function actualizarDatalist() {
        const datalist = document.getElementById("productos");
        datalist.innerHTML = ""; // Limpiar datalist
        productos.forEach((producto) => {
            const option = document.createElement("option");
            option.value = producto.nombre; // Nombre del producto como opción
            option.dataset.id = producto.id;
            datalist.appendChild(option);
        });
    }

    // Evento para agregar producto al pedido
    agregarProductoBtn.addEventListener("click", function () {
        const productoNombre = productosInput.value.trim();
        if (!productoNombre) {
            alert("Por favor, selecciona un producto.");
            return;
        }

        productoSeleccionado = productos.find((producto) => producto.nombre === productoNombre);
        if (!productoSeleccionado) {
            alert("Producto no encontrado");
            return;
        }

        // Si es un producto compuesto
        if (productoSeleccionado.subproductos && productoSeleccionado.subproductos.length > 0) {
            mostrarModalConfirmacionCompuesto();
        } else {
            mostrarModalConfirmacionSimple();
        }
    });

    // Mostrar el modal para confirmar producto simple
    function mostrarModalConfirmacionSimple() {
        cantidadSimpleInput.value = 1; // Valor inicial
        confirmacionSimpleModal.style.display = "flex";
    }

    // Mostrar el modal para confirmar producto compuesto
    function mostrarModalConfirmacionCompuesto() {
        subproductosList.innerHTML = ""; // Limpiar subproductos
        productoSeleccionado.subproductos.forEach((subproducto) => {
            const li = document.createElement("li");
            li.textContent = subproducto.nombre;
            subproductosList.appendChild(li);
        });
        confirmacionCompuestoModal.style.display = "flex";
    }

    // Confirmar cantidad para producto simple
    document.getElementById("confirmarSimpleBtn").addEventListener("click", function () {
        const cantidad = parseInt(cantidadSimpleInput.value);
        if (cantidad <= 0) {
            alert("La cantidad debe ser mayor que 0");
            return;
        }

        productosPedidoList.innerHTML += `
            <li>${productoSeleccionado.nombre} x${cantidad}</li>
        `;
        cerrarModal(confirmacionSimpleModal);
    });

    // Confirmar producto compuesto
    document.getElementById("confirmarCompuestoBtn").addEventListener("click", function () {
        productosPedidoList.innerHTML += `
            <li>${productoSeleccionado.nombre} (compuesto)</li>
        `;
        cerrarModal(confirmacionCompuestoModal);
    });

    // Cerrar modales
    document.getElementById("cerrarModalSimple").addEventListener("click", function () {
        cerrarModal(confirmacionSimpleModal);
    });

    document.getElementById("cerrarModalCompuesto").addEventListener("click", function () {
        cerrarModal(confirmacionCompuestoModal);
    });

    // Función para cerrar un modal
    function cerrarModal(modal) {
        modal.style.display = "none";
    }
});

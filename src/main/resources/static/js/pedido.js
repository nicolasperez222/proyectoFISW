// Variables para almacenar los productos y productos compuestos
let productosDisponibles = [];
let productosCompuestosDisponibles = [];
let productosSeleccionados = [];
let productosCompuestosSeleccionados = [];
let subproductosSeleccionados = [];

// Cargar productos y productos compuestos disponibles
document.addEventListener("DOMContentLoaded", () => {
    cargarProductosDisponibles();
    cargarProductosCompuestosDisponibles();
    setFechaCreacion();
});

// Establecer la fecha de creación por defecto
function setFechaCreacion() {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);
    document.getElementById('fechaCreacion').value = formattedDate;
}

// Cargar los productos simples desde el backend
function cargarProductosDisponibles() {
    fetch('/producto/')  // Endpoint para obtener productos
        .then(response => response.json())
        .then(productos => {
            productosDisponibles = productos;
            mostrarProductosEnLista('productos', productosDisponibles);
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Cargar los productos compuestos desde el backend
function cargarProductosCompuestosDisponibles() {
    fetch('/producto-compuesto/')  // Endpoint para obtener productos compuestos
        .then(response => response.json())
        .then(productosCompuestos => {
            productosCompuestosDisponibles = productosCompuestos;
            mostrarProductosEnLista('productosCompuestos', productosCompuestosDisponibles);
        })
        .catch(error => console.error('Error al cargar productos compuestos:', error));
}

// Mostrar los productos en la lista de selección
function mostrarProductosEnLista(tipo, productos) {
    const lista = document.getElementById(tipo);
    lista.innerHTML = '';  // Limpiar la lista antes de agregar los productos

    productos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.id;
        option.textContent = producto.nombre;
        lista.appendChild(option);
    });
}

// Buscar productos según el nombre
function buscarProducto() {
    const query = document.getElementById('buscarProducto').value.toLowerCase();

    // Filtrar productos simples y compuestos
    const productosFiltrados = productosDisponibles.filter(producto => producto.nombre.toLowerCase().includes(query));
    const productosCompuestosFiltrados = productosCompuestosDisponibles.filter(compuesto => compuesto.nombre.toLowerCase().includes(query));

    mostrarProductosEnLista('productos', productosFiltrados);
    mostrarProductosEnLista('productosCompuestos', productosCompuestosFiltrados);
}

// Cuando un producto compuesto es seleccionado
function seleccionarProductoCompuesto() {
    const productoCompuestoSeleccionado = document.getElementById('productosCompuestos').value;
    const productoCompuesto = productosCompuestosDisponibles.find(producto => producto.id == productoCompuestoSeleccionado);

    // Si el producto compuesto tiene subproductos, mostrar la selección
    if (productoCompuesto && productoCompuesto.subproductos && productoCompuesto.subproductos.length > 0) {
        mostrarSubproductos(productoCompuesto.subproductos);
    }
}

// Mostrar subproductos de un producto compuesto
function mostrarSubproductos(subproductos) {
    const subproductosContainer = document.getElementById('subproductosContainer');
    const subproductosList = document.getElementById('subproductosList');
    subproductosList.innerHTML = '';  // Limpiar la lista de subproductos

    subproductos.forEach(subproducto => {
        const li = document.createElement('li');
        li.textContent = subproducto.nombre;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = subproducto.id;
        checkbox.onclick = (e) => {
            if (e.target.checked) {
                subproductosSeleccionados.push(subproducto);
            } else {
                const index = subproductosSeleccionados.findIndex(sp => sp.id === subproducto.id);
                if (index > -1) {
                    subproductosSeleccionados.splice(index, 1);
                }
            }
        };

        li.appendChild(checkbox);
        subproductosList.appendChild(li);
    });

    subproductosContainer.style.display = 'block';
}

// Crear el pedido
function crearPedido() {
    const numeroMesa = document.getElementById('numeroMesa').value;
    const fechaCreacion = document.getElementById('fechaCreacion').value;
    const estadoPedido = document.getElementById('estadoPedido').value;

    // Crear un objeto de pedido con los productos seleccionados y sus subproductos (si los hay)
    const pedido = {
        numeroMesa: numeroMesa,
        fechaCreacion: fechaCreacion,
        estadoPedido: estadoPedido,
        productos: productosSeleccionados,
        productosCompuestos: productosCompuestosSeleccionados,
        subproductos: subproductosSeleccionados
    };

    // Enviar el pedido al backend
    fetch('/pedido/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('responseMessage').style.display = 'block';
        document.getElementById('responseMessage').textContent = "Pedido creado exitosamente.";
    })
    .catch(error => {
        console.error('Error al crear el pedido:', error);
    });
}

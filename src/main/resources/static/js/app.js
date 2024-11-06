async function cargarProductos() {
    try {
        // Realiza una solicitud GET a la API
        const response = await fetch('/producto/');
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }

        // Convierte la respuesta a formato JSON
        const productos = await response.json();

        // Selecciona el contenedor donde se mostrarán los productos
        const listaProductos = document.getElementById('productos-list');

        // Si no hay productos, muestra un mensaje
        if (productos.length === 0) {
            listaProductos.innerHTML = '<li>No hay productos disponibles.</li>';
            return;
        }

        // Itera sobre los productos y los agrega a la lista
        productos.forEach(producto => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${producto.nombre}</strong><br>
                Precio de Costo: $${producto.precioCosto}<br>
                Precio de Venta: $${producto.precioVenta}
            `;
            listaProductos.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Cargar los productos cuando se carga la página
window.onload = cargarProductos;
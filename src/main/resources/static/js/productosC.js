window.onload = function() {
    cargarDepartamentos(); // Cargar departamentos al iniciar
    mostrarFormulario('simple'); // Mostrar formulario de producto simple por defecto
};

// Función para cargar los departamentos
async function cargarDepartamentos() {
    try {
        const response = await fetch('/categoria/');
        const departamentos = await response.json();
        
        const departamentoSimpleSelect = document.getElementById('categoriaSimple');
        
        // Limpiar las opciones antes de agregar
        departamentoSimpleSelect.innerHTML = '';

        // Agregar opción por defecto
        const opcionDefault = document.createElement('option');
        opcionDefault.textContent = 'Seleccione un departamento';
        opcionDefault.value = '';
        departamentoSimpleSelect.appendChild(opcionDefault);

        // Agregar departamentos al select
        departamentos.forEach(departamento => {
            const option = document.createElement('option');
            option.value = departamento.id;
            option.textContent = departamento.nombre;
            departamentoSimpleSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los departamentos:', error);
    }
}

// Mostrar el formulario correspondiente
function mostrarFormulario(tipo) {
    document.getElementById('createProductFormSimple').style.display = tipo === 'simple' ? 'block' : 'none';
    document.getElementById('createProductFormCompuesto').style.display = tipo === 'compuesto' ? 'block' : 'none';
    document.getElementById('responseMessage').innerText = "";
}


// Crear Producto Simple
async function crearProductoSimple() {
    const nombre = document.getElementById('nombreSimple').value;
    const precioCosto = document.getElementById('precioCostoSimple').value;
    const precioVenta = document.getElementById('precioVentaSimple').value;
    const categoriaId = document.getElementById('categoriaSimple').value;

    try {
        const response = await fetch(`/producto/?categoriaId=${categoriaId || ''}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                precioCosto,
                precioVenta
            })
        });
        
        const data = await response.json();
        document.getElementById('responseMessage').innerText = response.ok ? 
            `Producto simple creado con ID: ${data.id}` : 'Error al crear el producto simple.';
    } catch (error) {
        console.error('Error al crear el producto simple:', error);
        document.getElementById('responseMessage').innerText = 'Error al crear el producto simple.';
    }
}


// Crear Producto Compuesto
async function crearProductoCompuesto() {
    const nombre = document.getElementById('nombreCompuesto').value;
    const precioBase = document.getElementById('precioBase').value;
    const categoriaId = document.getElementById('categoriaCompuesto').value;
    const departamentoId = document.getElementById('categoriaCompuesto').value;
    const categoriaParam = categoriaId ? categoriaId : null; 

    const subproductos = [];
    document.querySelectorAll('.subproducto').forEach(row => {
        const id = row.querySelector('.subproductoId').value;
        const cantidad = row.querySelector('.subproductoCantidad').value;
        subproductos.push({ id, cantidad });
    });

    try {
        const response = await fetch('/producto-compuesto/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                precioBase,
                categoriaId: categoriaParam,
                departamentoId,
                subproductos
            })
        });
        
        const data = await response.json();
        document.getElementById('responseMessage').innerText = response.ok ? 
            `Producto compuesto creado con ID: ${data.id}` : 'Error al crear el producto compuesto.';
    } catch (error) {
        console.error('Error al crear el producto compuesto:', error);
        document.getElementById('responseMessage').innerText = 'Error al crear el producto compuesto.';
    }
}



// Agregar campos de subproducto
function agregarSubproducto() {
    const subproductosContainer = document.getElementById('subproductosContainer');
    const subproductoRow = document.createElement('div');
    subproductoRow.classList.add('subproducto');
    
    subproductoRow.innerHTML = `
        <label>ID Subproducto: </label>
        <input type="number" class="subproductoId" required>
        <label>Cantidad: </label>
        <input type="number" class="subproductoCantidad" required>
    `;
    
    subproductosContainer.appendChild(subproductoRow);
}


// Función para seleccionar un producto desde la tabla de búsqueda
function seleccionarProducto(id, nombre, precioCosto, precioVenta, categoriaId) {
    document.getElementById('nombreSimple').value = nombre;
    document.getElementById('precioCostoSimple').value = precioCosto;
    document.getElementById('precioVentaSimple').value = precioVenta;
    document.getElementById('categoriaSimple').value = categoriaId;
    document.getElementById('modificar').style.display = 'block';
    document.getElementById('createProductFormSimple').dataset.productId = id;
    cerrarModalBuscarProducto();
}

// Función para crear o actualizar un producto simple
async function crearProductoSimple() {
    const form = document.getElementById('createProductFormSimple');
    const id = form.dataset.productId || null;
    const nombre = document.getElementById('nombreSimple').value;
    const precioCosto = document.getElementById('precioCostoSimple').value;
    const precioVenta = document.getElementById('precioVentaSimple').value;
    const categoriaId = document.getElementById('categoriaSimple').value;

    if (!nombre || !precioCosto || !precioVenta || !categoriaId) {
        mostrarMensaje('Por favor, completa todos los campos.', 'error');
        return;
    }

    try {
        const response = await fetch(id ? `/producto/${id}` : `/producto/`, {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, precioCosto, precioVenta, categoriaId })
        });

        const mensaje = response.ok 
            ? id ? 'Producto actualizado con éxito.' : 'Producto creado con éxito.' 
            : 'Error al procesar la solicitud.';

        mostrarMensaje(mensaje, response.ok ? 'success' : 'error');
        cancelarEdicion();

    } catch (error) {
        console.error('Error al procesar el producto:', error);
        mostrarMensaje('Error al procesar el producto.', 'error');
    }
}

// Función para cancelar la edición del producto
function cancelarEdicion() {
    document.getElementById('createProductFormSimple').reset();
    document.getElementById('modificar').style.display = 'none';
    delete document.getElementById('createProductFormSimple').dataset.productId;
}

// Función para buscar productos
async function buscar() {
    try {
        const modal = document.getElementById('modalBuscarProducto');
        modal.style.display = 'block';

        const response = await fetch('/producto/');
        const productos = await response.json();

        llenarTablaProductos(productos);

    } catch (error) {
        console.error('Error al buscar productos:', error);
    }
}

// Función para llenar la tabla con productos
function llenarTablaProductos(productos) {
    const tbody = document.querySelector('#tablaProductos tbody');
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precioCosto}</td>
            <td>${producto.precioVenta}</td>
            <td>
                <button onclick="seleccionarProducto(${producto.id}, '${producto.nombre}', ${producto.precioCosto}, ${producto.precioVenta}, ${producto.categoriaId})">Seleccionar</button>
                <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para eliminar un producto
async function eliminarProducto(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        try {
            const response = await fetch(`/producto/${id}`, { method: 'DELETE' });

            if (response.ok) {
                mostrarMensaje(`Producto con ID ${id} eliminado correctamente.`, 'success');
                buscar();
            } else {
                mostrarMensaje('Error al eliminar el producto.', 'error');
            }

        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            mostrarMensaje('Error al eliminar el producto.', 'error');
        }
    }
}

// Función para mostrar mensajes
function mostrarMensaje(texto, tipo = 'success') {
    const mensaje = document.getElementById('responseMessage');
    mensaje.innerText = texto;
    mensaje.className = tipo; // Define la clase CSS ('success', 'error')
    setTimeout(() => {
        mensaje.innerText = '';
        mensaje.className = '';
    }, 3000);
}

// Función para cerrar el modal de búsqueda
function cerrarModalBuscarProducto() {
    const modal = document.getElementById('modalBuscarProducto');
    modal.style.display = 'none';
}

async function filtrarProductos() {
    const filtro = document.getElementById('filtroProducto').value.toLowerCase(); // Toma el valor del input
    const tbody = document.querySelector('#tablaProductos tbody');

    try {
        // Llama al backend con el filtro
        const response = await fetch(`/producto/buscar?filtro=${filtro}`);
        const productos = await response.json();

        // Limpia la tabla
        tbody.innerHTML = '';

        // Llena la tabla con los productos filtrados
        productos.forEach(producto => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.precioCosto}</td>
                <td>${producto.precioVenta}</td>
                <td>
                    <button onclick="seleccionarProducto(${producto.id}, '${producto.nombre}', ${producto.precioCosto}, ${producto.precioVenta})">Seleccionar</button>
                    <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al filtrar productos:', error);
    }
}

// Función para seleccionar un producto desde la tabla de búsqueda
function seleccionarProducto(id, nombre, precioCosto, precioVenta, categoriaId) {
    // Asignar los valores seleccionados al formulario de producto simple
    document.getElementById('nombreSimple').value = nombre;
    document.getElementById('precioCostoSimple').value = precioCosto;
    document.getElementById('precioVentaSimple').value = precioVenta;
    document.getElementById('categoriaSimple').value = categoriaId;

    // Mostrar la sección de actualización y ocultar el botón de crear
    document.getElementById('modificar').style.display = 'block';

    // Guardar el ID del producto seleccionado para la actualización
    document.getElementById('createProductFormSimple').dataset.productId = id;

    // Cerrar el modal de búsqueda
    cerrarModalBuscarProducto();
}

// Función para actualizar un producto
async function actualizarProducto() {
    const id = document.getElementById('createProductFormSimple').dataset.productId;
    const nombre = document.getElementById('nombreSimple').value;
    const precioCosto = document.getElementById('precioCostoSimple').value;
    const precioVenta = document.getElementById('precioVentaSimple').value;
    const categoriaId = document.getElementById('categoriaSimple').value;

    if (!id) {
        alert('No hay un producto seleccionado para actualizar.');
        return;
    }

    try {
        const response = await fetch(`/producto/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                precioCosto,
                precioVenta,
                categoriaId
            })
        });

        const mensaje = response.ok 
            ? `Producto actualizado con éxito.` 
            : 'Error al actualizar el producto.';
            
        const responseMessageElement = document.getElementById('responseMessage');
        responseMessageElement.innerText = mensaje;
        setTimeout(() => {
            responseMessageElement.innerText = '';
        }, 3000);

        // Limpiar el formulario y ocultar la sección de actualizar
        cancelarEdicion();

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
}

// Función para cancelar la edición del producto
function cancelarEdicion() {
    // Limpiar los campos del formulario
    document.getElementById('createProductFormSimple').reset();

    // Ocultar la sección de actualizar y mostrar el botón de crear
    document.getElementById('modificar').style.display = 'none';

    // Eliminar el ID del producto seleccionado
    delete document.getElementById('createProductFormSimple').dataset.productId;
}

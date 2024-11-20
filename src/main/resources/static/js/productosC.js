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
        opcionDefault.textContent = 'Ninguno';
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

    if (!nombre || !precioCosto || !precioVenta) {
        mostrarMensaje('Todos los campos son obligatorios, excepto la categoría.', 'error');
        return;
    }

    try {
        // Enviar la solicitud POST al backend
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

        if (response.ok) {
            mostrarMensaje(`Producto simple creado con ID: ${data.id}`, 'success');
        } else {
            mostrarMensaje('Error al crear el producto simple.', 'error');
        }

    } catch (error) {
        console.error('Error al crear el producto simple:', error);
        mostrarMensaje('Error al crear el producto simple.', 'error');
    }
}


// Crear Producto Compuesto
async function crearProductoCompuesto() {
    const nombre = document.getElementById('nombreCompuesto').value;
    const precioBase = document.getElementById('precioBase').value;
    const categoriaId = document.getElementById('categoriaCompuesto').value;
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
            <td>${producto.categoria ? producto.categoria.nombre : 'Sin categoría'}</td>
            <td>
                <button onclick="seleccionarProducto(${producto.id}, '${producto.nombre}', ${producto.precioCosto}, ${producto.precioVenta}, ${producto.categoria ? producto.categoria.id : null})">Seleccionar</button>
                <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
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
    const filtro = document.getElementById('filtroProducto').value.toLowerCase(); 
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
                <td>${producto.categoria ? producto.categoria.nombre : 'Sin categoría'}</td>
                <td>
                    <button onclick="seleccionarProducto(${producto.id}, '${producto.nombre}', ${producto.precioCosto}, ${producto.precioVenta}, ${producto.categoria ? producto.categoria.id : null})">Seleccionar</button>
                    <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
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
    // Establece los valores en los campos del formulario
    document.getElementById('nombreSimple').value = nombre;
    document.getElementById('precioCostoSimple').value = precioCosto;
    document.getElementById('precioVentaSimple').value = precioVenta;

    // Establece el id del producto para la edición
    const form = document.getElementById('createProductFormSimple');
    form.dataset.productId = id;

    // Si hay una categoría, selecciona el valor en el campo de categoría
    const categoriaSelect = document.getElementById('categoriaSimple');
    categoriaSelect.value = categoriaId ? categoriaId : ''; // Selecciona la categoría si existe

    // Oculta el botón de crear y muestra el de actualizar
    document.getElementById('crearSimple').style.display = 'none';
    document.getElementById('modificar').style.display = 'inline-block';
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

    const productoData = {
        nombre,
        precioCosto,
        precioVenta,
        categoriaId: categoriaId ? categoriaId : null 
    };

    try {
        const response = await fetch(`/producto/${id}?categoriaId=${categoriaId}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData) 
        });

        const mensaje = response.ok 
            ? `Producto actualizado con éxito.` 
            : 'Error al actualizar el producto.';

        const responseMessageElement = document.getElementById('responseMessage');
        responseMessageElement.innerText = mensaje;
        setTimeout(() => {
            responseMessageElement.innerText = '';
        }, 3000);


        cancelarEdicion();

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    } finally {
        document.getElementById('crearSimple').style.display = 'inline-block';
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
    document.getElementById('crearSimple').style.display = 'inline-block';

}

function mostrarMensaje(mensaje, tipo) {
    const responseMessageElement = document.getElementById('responseMessage');
    responseMessageElement.innerText = mensaje;
    responseMessageElement.classList.remove('success', 'error'); // Eliminar clases previas
    responseMessageElement.classList.add(tipo); // Agregar clase según el tipo (success o error)

    responseMessageElement.style.display = 'block'; // Mostrar el mensaje
    setTimeout(() => {
        responseMessageElement.style.opacity = '0'; // Desvanecer el mensaje
        setTimeout(() => {
            responseMessageElement.style.display = 'none'; // Ocultar el mensaje completamente después de la transición
            responseMessageElement.style.opacity = '1'; // Resetear la opacidad para la próxima vez
        }, 500); // Espera a que termine la animación de desvanecimiento
    }, 3000); // El mensaje permanecerá visible durante 3 segundos
}



//PRODUCTO COMPUESTO

let subproductosSeleccionados = [];  // Array para almacenar los subproductos seleccionados
let subproductoEditando = null;      // Variable para almacenar el subproducto que se está editando

function mostrarFormularioSubproducto() {
    // Mostrar el formulario para agregar subproducto
    document.getElementById('formSubproducto').style.display = 'block';
    subproductoEditando = null; // Asegura que no haya un subproducto siendo editado
    document.getElementById('cantidadSubproducto').value = 1; // Restablecer cantidad
}

function cancelarAgregarSubproducto() {
    // Ocultar el formulario para agregar subproducto
    document.getElementById('formSubproducto').style.display = 'none';
    document.getElementById('buscarSubproducto').value = '';
    document.getElementById('resultadosBusqueda').style.display = 'none';
}

async function buscarSubproductoPorNombre() {
    const query = document.getElementById('buscarSubproducto').value;

    if (query.length < 3) {
        document.getElementById('resultadosBusqueda').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`/producto/buscar?filtro=${query}`);
        const productos = await response.json();

        // Mostrar los resultados de la búsqueda de subproductos
        const listaResultados = document.getElementById('resultadosBusqueda');
        listaResultados.innerHTML = '';  // Limpiar resultados anteriores

        productos.forEach(producto => {
            const item = document.createElement('li');
            item.textContent = producto.nombre;
            item.setAttribute('data-id', producto.id);
            item.onclick = () => seleccionarSubproducto(producto);
            listaResultados.appendChild(item);
        });

        // Mostrar los resultados solo si hay al menos uno
        listaResultados.style.display = productos.length > 0 ? 'block' : 'none';
    } catch (error) {
        console.error('Error al buscar subproductos:', error);
    }
}

function seleccionarSubproducto(producto) {
    const cantidad = document.getElementById('cantidadSubproducto').value;

    // Verificar que se haya seleccionado una cantidad válida
    if (cantidad <= 0) {
        alert('Por favor, ingrese una cantidad válida.');
        return;
    }

    if (subproductoEditando) {
        // Si se está editando un subproducto, actualizar la cantidad y nombre
        subproductoEditando.nombre = producto.nombre;
        subproductoEditando.productoId = producto.id;
        subproductoEditando.cantidad = cantidad;
    } else {
        // Si no se está editando, agregar un nuevo subproducto
        subproductosSeleccionados.push({
            productoId: producto.id,
            nombre: producto.nombre,
            cantidad: cantidad
        });
    }

    // Actualizar la lista de subproductos
    actualizarListaSubproductos();
    cancelarAgregarSubproducto();
}

function actualizarListaSubproductos() {
    const lista = document.getElementById('listaSubproductos');
    lista.innerHTML = ''; 

    subproductosSeleccionados.forEach((subproducto, index) => {
        const item = document.createElement('li');
        item.innerHTML = `${subproducto.nombre} (Cantidad: ${subproducto.cantidad}) 
        <button type="button" onclick="editarSubproducto(${index})">Editar</button>
        <button type="button" onclick="eliminarSubproducto(${index})">Eliminar</button>`;
        lista.appendChild(item);
    });
}

function editarSubproducto(index) {
    subproductoEditando = subproductosSeleccionados[index];

    // Mostrar el formulario de subproducto con los datos para editar
    document.getElementById('formSubproducto').style.display = 'block';
    document.getElementById('buscarSubproducto').value = subproductoEditando.nombre;
    document.getElementById('cantidadSubproducto').value = subproductoEditando.cantidad;
}

function eliminarSubproducto(index) {
    subproductosSeleccionados.splice(index, 1); // Eliminar el subproducto de la lista
    actualizarListaSubproductos(); 
}

async function crearProductoCompuesto() {
    const nombre = document.getElementById('nombreCompuesto').value;
    const precioBase = document.getElementById('precioBase').value;
    const categoriaId = document.getElementById('categoriaCompuesto').value;

    // Crear el objeto del producto compuesto
    const productoCompuesto = {
        nombre,
        precioBase,
        categoriaId,
        subproductos: subproductosSeleccionados
    };

    try {
        const response = await fetch('/producto/compuesto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoCompuesto)
        });

        if (response.ok) {
            document.getElementById('responseMessage').innerText = 'Producto compuesto creado con éxito';
        } else {
            document.getElementById('responseMessage').innerText = 'Error al crear el producto compuesto';
        }
    } catch (error) {
        console.error('Error al crear producto compuesto:', error);
        document.getElementById('responseMessage').innerText = 'Error al crear el producto compuesto';
    }

    // Limpiar el formulario
    document.getElementById('createProductFormCompuesto').reset();
    document.getElementById('subproductosContainer').innerHTML = '';
    subproductosSeleccionados = [];  // Limpiar la lista de subproductos seleccionados
    document.getElementById('responseMessage').style.display = 'block';
    setTimeout(() => document.getElementById('responseMessage').style.display = 'none', 3000);
}



function agregarSubproducto() {
    const nombreSubproducto = document.getElementById('buscarSubproducto').value; // Obtener el nombre del subproducto
    const cantidadSubproducto = parseInt(document.getElementById('cantidadSubproducto').value, 10); // Obtener la cantidad como número

    // Verificar que la cantidad sea válida
    if (isNaN(cantidadSubproducto) || cantidadSubproducto <= 0) {
        alert('Por favor, ingrese una cantidad válida mayor que 0.');
        return;
    }

    // Verificar que el nombre no esté vacío
    if (nombreSubproducto.trim() === '') {
        alert('Por favor, ingrese un nombre válido para el subproducto.');
        return;
    }

    // Crear el objeto subproducto
    const subproducto = {
        nombre: nombreSubproducto,
        cantidad: cantidadSubproducto
    };

    // Verificar si ya existe un subproducto con ese nombre
    const indexExistente = subproductosSeleccionados.findIndex(sub => sub.nombre === subproducto.nombre);

    if (indexExistente >= 0) {
        // Si el subproducto ya existe, sumamos la cantidad correctamente (no concatenamos)
        subproductosSeleccionados[indexExistente].cantidad = cantidadSubproducto;
    } else {
        // Si el subproducto no existe, lo agregamos a la lista
        subproductosSeleccionados.push(subproducto);
    }

    // Actualizar la lista de subproductos visualmente
    actualizarListaSubproductos();

    // Limpiar el campo de búsqueda y cantidad
    document.getElementById('buscarSubproducto').value = '';
    document.getElementById('cantidadSubproducto').value = 1;

    // Ocultar el formulario de agregar subproducto
    document.getElementById('formSubproducto').style.display = 'none';
}



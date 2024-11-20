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
    document.getElementById('createProductFormSimple').reset();

    document.getElementById('modificar').style.display = 'none';

    delete document.getElementById('createProductFormSimple').dataset.productId;
    document.getElementById('crearSimple').style.display = 'inline-block';

}

function mostrarMensaje(mensaje, tipo) {
    const responseMessageElement = document.getElementById('responseMessage');
    responseMessageElement.innerText = mensaje;
    responseMessageElement.classList.remove('success', 'error');
    responseMessageElement.classList.add(tipo);

    responseMessageElement.style.display = 'block';
    setTimeout(() => {
        responseMessageElement.style.opacity = '0';
        setTimeout(() => {
            responseMessageElement.style.display = 'none'; 
            responseMessageElement.style.opacity = '1'; 
        }, 500);
    }, 3000);
}



//PRODUCTO COMPUESTO

let subproductosSeleccionados = []; 
let subproductoEditando = null;     

function mostrarFormularioSubproducto() {
    document.getElementById('formSubproducto').style.display = 'block';
    subproductoEditando = null; 
    document.getElementById('cantidadSubproducto').value = 1;
}

function cancelarAgregarSubproducto() {
    // Ocultar el formulario para agregar subproducto
    document.getElementById('formSubproducto').style.display = 'none';
    document.getElementById('buscarSubproducto').value = '';
    document.getElementById('resultadosBusqueda').style.display = 'none';
}

async function buscarSubproductoPorNombre() {
    const query = document.getElementById('buscarSubproducto').value;

    // Verificar que el usuario haya ingresado al menos 3 caracteres
    if (query.length < 3) {
        document.getElementById('resultadosBusqueda').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`/producto/buscar?filtro=${query}`);
        const productos = await response.json();

        // Mostrar los resultados de la búsqueda de subproductos
        const listaResultados = document.getElementById('resultadosBusqueda');
        listaResultados.innerHTML = ''; // Limpiar resultados anteriores

        productos.forEach(producto => {
            const item = document.createElement('li');
            item.textContent = producto.nombre;
            item.setAttribute('data-id', producto.id); 
            item.style.cursor = 'pointer';
            item.onclick = () => {
                document.getElementById('buscarSubproducto').value = producto.nombre;
                document.getElementById('buscarSubproducto').dataset.id = producto.id;
                listaResultados.style.display = 'none'; 
            };
            listaResultados.appendChild(item);
        });

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
    // Obtener valores del formulario
    const nombre = document.getElementById('nombreCompuesto').value;
    const precioBase = parseFloat(document.getElementById('precioBase').value);
    const categoriaId = document.getElementById('categoriaCompuesto').value;
    
    // Subproductos seleccionados
    const subproductos = subproductosSeleccionados.map(subproducto => ({
        subproducto: { id: subproducto.id },
        cantidad: subproducto.cantidad
    }));

    // Validar que haya subproductos
    if (subproductos.length === 0) {
        mostrarMensaje('Debes agregar al menos un subproducto.', 'error');
        return;
    }

    // Crear el objeto a enviar
    const productoCompuesto = {
        nombre,
        precioBase,
        categoria: categoriaId ? { id: parseInt(categoriaId) } : null,
        subproductos
    };

    try {
        
        const response = await fetch('/producto-compuesto/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoCompuesto)
        });
        

        // Verificar la respuesta
        if (response.ok) {
            const data = await response.json();
            mostrarMensaje(`Producto compuesto creado con éxito. ID: ${data.id}`, 'success');
            limpiarFormularioProductoCompuesto();
        } else {
            const errorText = await response.text();
            mostrarMensaje(`Error al crear el producto compuesto: ${errorText}`, 'error');
        }
    } catch (error) {
        console.error('Error al crear el producto compuesto:', error);
        mostrarMensaje('Error al conectar con el servidor.', 'error');
    }
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



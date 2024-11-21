window.onload = function() {
    cargarDepartamentos(); 
    mostrarFormulario('simple'); 
};

// Función para cargar los departamentos
async function cargarDepartamentos() {
    try {
        const response = await fetch('/categoria/');
        const departamentos = await response.json();
        
        const departamentoSimpleSelect = document.getElementById('categoriaSimple');
        const departamentoSimpleSelectC = document.getElementById('categoriaCompuesto');
        
        // Limpiar las opciones existentes
        departamentoSimpleSelect.innerHTML = '';
        departamentoSimpleSelectC.innerHTML = '';
      
        const opcionDefault = document.createElement('option');
        opcionDefault.textContent = 'Ninguno';
        opcionDefault.value = '';
        departamentoSimpleSelect.appendChild(opcionDefault);
        
        const opcionDefaultC = document.createElement('option');
        opcionDefaultC.textContent = 'Ninguno';
        opcionDefaultC.value = '';
        departamentoSimpleSelectC.appendChild(opcionDefaultC);
        
        departamentos.forEach(departamento => {
            const optionSimple = document.createElement('option');
            optionSimple.value = departamento.id;
            optionSimple.textContent = departamento.nombre;
            departamentoSimpleSelect.appendChild(optionSimple);
        
            const optionCompuesto = document.createElement('option');
            optionCompuesto.value = departamento.id;
            optionCompuesto.textContent = departamento.nombre;
            departamentoSimpleSelectC.appendChild(optionCompuesto);
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
    mensaje.className = tipo; 
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

        const response = await fetch(`/producto/buscar?filtro=${filtro}`);
        const productos = await response.json();

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
    } catch (error) {
        console.error('Error al filtrar productos:', error);
    }
}

// Función para seleccionar un producto desde la tabla de búsqueda
function seleccionarProducto(id, nombre, precioCosto, precioVenta, categoriaId) {
    document.getElementById('nombreSimple').value = nombre;
    document.getElementById('precioCostoSimple').value = precioCosto;
    document.getElementById('precioVentaSimple').value = precioVenta;

    const form = document.getElementById('createProductFormSimple');
    form.dataset.productId = id;

    const categoriaSelect = document.getElementById('categoriaSimple');
    categoriaSelect.value = categoriaId ? categoriaId : '';

    document.getElementById('crearSimple').style.display = 'none';
    document.getElementById('modificar').style.display = 'inline-block';
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
    responseMessageElement.style.opacity = '1'; 

    setTimeout(() => {
        responseMessageElement.style.opacity = '0';
        setTimeout(() => {
            responseMessageElement.style.display = 'none';
            responseMessageElement.style.opacity = '1'; 
        }, 500);
    }, 3000);
}



//PRODUCTO COMPUESTO
function mostrarMensajeC(mensaje, tipo) {
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

let subproductosSeleccionados = []; 
let subproductoEditando = null;     


function limpiarFormularioProductoCompuesto() {

    document.getElementById("nombreCompuesto").value = "";
    document.getElementById("precioBase").value = "";
    document.getElementById("categoriaCompuesto").selectedIndex = 0;
    idPM = null;
    const listaSubproductos = document.getElementById("listaSubproductos");
    listaSubproductos.innerHTML = ""; 

    document.getElementById("responseMessage").textContent = "";

    subproductosSeleccionados = [];
    subproductoEditando = null;
}

function mostrarFormularioSubproducto() {
    document.getElementById('formSubproducto').style.display = 'block';
    subproductoEditando = null; 
    document.getElementById('cantidadSubproducto').value = 1;
}

function cancelarAgregarSubproducto() {
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
        const listaResultados = document.getElementById('resultadosBusqueda');
        listaResultados.innerHTML = '';

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
    if (cantidad <= 0) {
        alert('Por favor, ingrese una cantidad válida.');
        return;
    }

    if (subproductoEditando) {
        subproductoEditando.nombre = producto.nombre;
        subproductoEditando.id = producto.id;
        subproductoEditando.cantidad = cantidad;
    } else {
        subproductosSeleccionados.push({
            id: producto.id,
            nombre: producto.nombre,
            cantidad: cantidad
        });
        
    }

    actualizarListaSubproductos();
    cancelarAgregarSubproducto();
}

function actualizarListaSubproductos() {
    const lista = document.getElementById('listaSubproductos');
    lista.innerHTML = ''; 

    subproductosSeleccionados.forEach((subproducto, index) => {
        const item = document.createElement('li');
        item.innerHTML = `ID: ${subproducto.id} - ${subproducto.nombre} (Cantidad: ${subproducto.cantidad}) 
        <button type="button" onclick="editarSubproducto(${index})">Editar</button>
        <button type="button" onclick="eliminarSubproducto(${index})">Eliminar</button>`;
        lista.appendChild(item);
    });
}

function editarSubproducto(index) {
    subproductoEditando = subproductosSeleccionados[index];

    document.getElementById('formSubproducto').style.display = 'block';
    document.getElementById('buscarSubproducto').value = subproductoEditando.nombre;
    document.getElementById('cantidadSubproducto').value = subproductoEditando.cantidad;
}

function eliminarSubproducto(index) {
    subproductosSeleccionados.splice(index, 1);
    actualizarListaSubproductos(); 
}
async function crearProductoCompuesto() {
    const nombre = document.getElementById('nombreCompuesto').value;
    const precioBase = parseFloat(document.getElementById('precioBase').value);
    const categoriaId = document.getElementById('categoriaCompuesto').value;

    if (!nombre || !precioBase) {
        mostrarMensaje('El nombre y el precio base son obligatorios.', 'error');
        return;
    }

    const subproductos = subproductosSeleccionados.map(subproducto => ({
        subproducto: { id: parseInt(subproducto.id, 10) },
        cantidad: subproducto.cantidad
    }));

    if (subproductos.length === 0) {
        mostrarMensaje('Debes agregar al menos un subproducto.', 'error');
        return;
    }

    const productoCompuesto = {
        nombre,
        precioBase,
        categoria: categoriaId ? { id: parseInt(categoriaId, 10) } : null, 
        subproductos
    };

    const jsonProductoCompuesto = JSON.stringify(productoCompuesto, null, 2);

    try {
        const response = await fetch('/producto-compuesto/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonProductoCompuesto
        });

        if (response.ok) {
    
            mostrarMensaje(`Producto creado correctamente.`, 'success');
            limpiarFormularioProductoCompuesto();
        } else {
            const errorText = await response.text();
            mostrarMensaje(`Error al crear el producto compuesto: ${errorText}`, 'error');
        }
    } catch (error) {
        mostrarMensaje('Error al conectar con el servidor.', 'error');
    }
}


function agregarSubproducto() {
    const nombreSubproducto = document.getElementById('buscarSubproducto').value;
    const idSubproducto = document.getElementById('buscarSubproducto').dataset.id;
    const cantidadSubproducto = parseInt(document.getElementById('cantidadSubproducto').value, 10); 

    if (isNaN(cantidadSubproducto) || cantidadSubproducto <= 0) {
        alert('Por favor, ingrese una cantidad válida mayor que 0.');
        return;
    }

    if (nombreSubproducto.trim() === '') {
        alert('Por favor, ingrese un nombre válido para el subproducto.');
        return;
    }

    const subproducto = {
        nombre: nombreSubproducto,
        cantidad: cantidadSubproducto,
        id: parseInt(idSubproducto, 10)
    };

    const indexExistente = subproductosSeleccionados.findIndex(sub => sub.nombre === subproducto.nombre);

    if (indexExistente >= 0) {
        subproductosSeleccionados[indexExistente].cantidad = cantidadSubproducto;
    } else {
        subproductosSeleccionados.push(subproducto);
    }

    actualizarListaSubproductos();
    document.getElementById('buscarSubproducto').value = '';
    document.getElementById('cantidadSubproducto').value = 1;

    document.getElementById('formSubproducto').style.display = 'none';
}


// Función para buscar productos
async function buscarCompuesto() {
    try {
        const modal = document.getElementById('modalBuscarProductoCompuesto');
        modal.style.display = 'block';
        const response = await fetch('/producto-compuesto/');
        const productos = await response.json();

        llenarTablaProductosCompuesto(productos);

    } catch (error) {
        console.error('Error al buscar productos:', error);
    }
}


// Función para cerrar el modal de búsqueda
function cerrarModalBuscarProductoCompuesto() {
    const modal = document.getElementById('modalBuscarProductoCompuesto');
    modal.style.display = 'none';
}

async function filtrarProductosCompuesto() {
    const filtro = document.getElementById('filtroProductoC').value.trim(); 
    const tbody = document.querySelector('#tablaProductosC tbody');

    // Validar filtro vacío
    if (!filtro) {
        console.warn('El campo de filtro está vacío.');
        mostrarMensaje('Por favor ingrese un término de búsqueda.', 'error');
        return;
    }

    // Mostrar indicador de carga
    tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';

    try {
        const response = await fetch(`/producto-compuesto/buscar?filtro=${encodeURIComponent(filtro)}`);
        
        if (!response.ok) throw new Error('Error al realizar la búsqueda');

        const productos = await response.json();

        tbody.innerHTML = '';

        if (productos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No se encontraron productos.</td></tr>';
            return;
        }

        productos.forEach(producto => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${producto.id || 'N/A'}</td>
                <td>${producto.nombre || 'Sin nombre'}</td>
                <td>${producto.precioBase != null ? producto.precioBase : 'N/A'}</td>
                <td>${producto.categoria?.nombre || 'Sin categoría'}</td>
                <td>
                    <button onclick="seleccionarProductoC(${producto.id}, '${producto.nombre}', ${producto.precioBase || 0}, ${producto.categoria?.id || null})">Seleccionar</button>
                    <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al filtrar productos:', error);
        tbody.innerHTML = '<tr><td colspan="5">Hubo un problema al buscar productos.</td></tr>';
    }
}


// Función para llenar la tabla con productos
function llenarTablaProductosCompuesto(productos) {
    const tbody = document.querySelector('#tablaProductosC tbody');
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precioBase}</td>
            <td>${producto.categoria ? producto.categoria.nombre : 'Sin categoría'}</td>
            <td>
                <button onclick="seleccionarProductoC(${producto.id}, '${producto.nombre}', ${producto.precioVenta}, ${producto.categoria ? producto.categoria.id : null})">Seleccionar</button>
                <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para seleccionar un producto desde la tabla de búsqueda
var idPM;
async function seleccionarProductoC(idProducto, nombre, precioBase, idCategoria) {
    try {
        idPM = idProducto;
        cerrarModalBuscarProductoCompuesto();
        const response = await fetch(`/producto-compuesto/${idProducto}`);
        if (!response.ok) throw new Error('Error al obtener el producto compuesto');

        const productoCompuesto = await response.json();

        // Llenar el formulario con los datos del producto compuesto
        document.getElementById('nombreCompuesto').value = productoCompuesto.nombre || nombre;
        document.getElementById('precioBase').value = productoCompuesto.precioBase || precioBase;
        document.getElementById('categoriaCompuesto').value = productoCompuesto.categoria?.id || idCategoria;

        // Cargar los subproductos en subproductosSeleccionados
        subproductosSeleccionados = productoCompuesto.subproductos.map(subWrapper => ({
            id: subWrapper.subproducto.id,
            nombre: subWrapper.subproducto.nombre,
            cantidad: subWrapper.cantidad,
        }));

        // Actualizar la lista visual de subproductos
        actualizarListaSubproductos();

        // Mostrar el formulario
        document.getElementById('createProductFormCompuesto').style.display = 'block';

        // Mostrar botones de actualizar y cancelar
        document.getElementById('actualizarCompuesto').style.display = 'inline-block';
        document.getElementById('cancelarEdicionCompuesto').style.display = 'inline-block';
        
    } catch (error) {
        console.error('Error al seleccionar el producto compuesto:', error);
        mostrarMensaje('Hubo un error al cargar el producto compuesto.', 'error');
    }
}


function actualizarListaSubproductos() {
    const listaSubproductos = document.getElementById('listaSubproductos');
    listaSubproductos.innerHTML = ''; 

    subproductosSeleccionados.forEach((subproducto, index) => {
        const li = document.createElement('li');
        li.className = 'subproducto-item';
        li.dataset.index = index;

        const texto = document.createElement('span');
        texto.textContent = `${subproducto.nombre} - Cantidad: ${subproducto.cantidad}`;
        texto.style.marginRight = '20px';

        const btnContainer = document.createElement('div');
        btnContainer.className = 'btn-container';

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn btn-danger btn-sm';
        btnEliminar.onclick = () => eliminarSubproducto(index);

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn btn-warning btn-sm';
        btnEditar.onclick = () => editarSubproducto(index);

        btnContainer.appendChild(btnEliminar);
        btnContainer.appendChild(btnEditar);

        li.appendChild(texto);
        li.appendChild(btnContainer);

        listaSubproductos.appendChild(li);
    });
}


function eliminarSubproducto(index) {
    // Eliminar el subproducto de la lista
    subproductosSeleccionados.splice(index, 1);
    actualizarListaSubproductos();
}

function editarSubproducto(index) {
    const subproducto = subproductosSeleccionados[index];

    // Mostrar el formulario de edición con los datos del subproducto
    document.getElementById('formSubproducto').style.display = 'block';
    document.getElementById('buscarSubproducto').value = subproducto.nombre;
    document.getElementById('cantidadSubproducto').value = subproducto.cantidad;

    // Guardar el índice en un atributo para confirmar la edición
    document.getElementById('formSubproducto').dataset.index = index;
}

function confirmarEdicionSubproducto() {
    const index = parseInt(document.getElementById('formSubproducto').dataset.index, 10);
    const cantidad = parseInt(document.getElementById('cantidadSubproducto').value, 10);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, ingrese una cantidad válida mayor que 0.');
        return;
    }

    subproductosSeleccionados[index].cantidad = cantidad;
    actualizarListaSubproductos();

    // Ocultar el formulario de edición
    document.getElementById('formSubproducto').style.display = 'none';
    mostrarMensaje('Subproducto editado correctamente.', 'success');
}


function cancelarEdicionCompuesto() {
    document.getElementById('createProductFormCompuesto').style.display = 'none';
    document.getElementById('nombreCompuesto').value = '';
    document.getElementById('precioBase').value = '';
    document.getElementById('categoriaCompuesto').value = '';
    document.getElementById('actualizarCompuesto').style.display = 'none';
    document.getElementById('cancelarEdicionCompuesto').style.display = 'none';

    subproductosSeleccionados = [];
    actualizarListaSubproductos();
    idPM = null;

    
}

async function actualizarProductoCompuesto() {

    const nombreCompuesto = document.getElementById('nombreCompuesto').value.trim();
    const precioBase = parseFloat(document.getElementById('precioBase').value);
    const categoriaCompuesto = document.getElementById('categoriaCompuesto').value;

    if (!nombreCompuesto) {
        mostrarMensaje('El nombre del producto compuesto es obligatorio.', 'error');
        return;
    }

    if (isNaN(precioBase) || precioBase <= 0) {
        mostrarMensaje('El precio base debe ser un número positivo.', 'error');
        return;
    }

    console.log(nombreCompuesto + " " + precioBase + " ");
    const categoria = categoriaCompuesto ? { id: parseInt(categoriaCompuesto, 10) } : null;

    const subproductosActualizados = subproductosSeleccionados.map(subproducto => ({
        subproducto: { id: subproducto.id }, 
        cantidad: subproducto.cantidad,  
    }));

    const productoCompuestoActualizado = {
        nombre: nombreCompuesto,
        precioBase: precioBase,
        categoria: categoria,
        subproductos: subproductosActualizados
    };

    try {
        const response = await fetch(`/producto-compuesto/actualizar/${idPM}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoCompuestoActualizado)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el producto compuesto');
        }

        const productoCompuesto = await response.json();

        console.log('Producto compuesto actualizado:', productoCompuesto);

        mostrarMensaje('Producto compuesto actualizado correctamente', 'success');
        
        limpiarFormularioProductoCompuesto();

    } catch (error) {
        console.error('Error al actualizar el producto compuesto:', error);
        mostrarMensaje('Hubo un error al actualizar el producto compuesto.', 'error');
    }
}



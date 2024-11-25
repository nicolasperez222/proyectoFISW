let subproductosSeleccionadosSimple = [];
let simpleEditando = null;

let subproductosSeleccionados = [];
let subproductoEditando = null;

let compuestosSeleccionados = [];
let compuestoEditando = null;

const ahora = new Date();

const utc5 = new Date(ahora.getTime() - 5 * 60 * 60 * 1000);
const fechaFormateada = utc5.toISOString().slice(0, 16).replace('T', ' ');
document.getElementById('fecha').value = fechaFormateada;


async function buscarSimplePorNombre() {
    const query = document.getElementById('buscarSimple').value;
    if (query.length < 2) {
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
                document.getElementById('buscarSimple').value = producto.nombre;
                document.getElementById('buscarSimple').dataset.id = producto.id;

                document.getElementById('productoSimple').value = producto.nombre;
                document.getElementById('productoSimple').dataset.id = producto.id;

                listaResultados.style.display = 'none'; 
                document.getElementById('confirmacionSimple').style.display = 'block';
            };
            listaResultados.appendChild(item);
        });

        listaResultados.style.display = productos.length > 0 ? 'block' : 'none';
        

    } catch (error) {
        console.error('Error al buscar subproductos:', error);
    }
}



async function confirmarSimple() {
    const nombreSubproducto = document.getElementById('productoSimple').value;
    const idSubproducto = document.getElementById('productoSimple').dataset.id;
    const cantidadSubproducto = parseInt(document.getElementById('cantidadSimple').value, 10); 

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

    const indexExistente = subproductosSeleccionadosSimple.findIndex(sub => sub.nombre === subproducto.nombre);

    if (indexExistente >= 0) {
        subproductosSeleccionadosSimple[indexExistente].cantidad = cantidadSubproducto;
    } else {
        subproductosSeleccionadosSimple.push(subproducto);
    }

    actualizarListaSimple();

    document.getElementById('confirmacionSimple').style.display = 'none';
    document.getElementById('buscarSimple').value = '';
}

async function cancelarSimple(){
    document.getElementById('buscarSubproducto').value = '';
    document.getElementById('cantidadSimple').value = 1;
    document.getElementById('productoSimple').value = '';

    document.getElementById('confirmacionSimple').style.display = 'none';
}


function actualizarListaSimple() {
    const listaSubproductos = document.getElementById('listaSimple');
    listaSubproductos.innerHTML = '';

    subproductosSeleccionadosSimple.forEach((subproducto, index) => {
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
        btnEliminar.onclick = () => eliminarSimple(index);

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn btn-warning btn-sm';
        btnEditar.onclick = () => editarSimple(index);

        btnContainer.appendChild(btnEliminar);
        btnContainer.appendChild(btnEditar);

        li.appendChild(texto);
        li.appendChild(btnContainer);

        listaSubproductos.appendChild(li);
    });
}

function eliminarSimple(index) {
    subproductosSeleccionadosSimple.splice(index, 1);
    actualizarListaSimple(); 
}

function editarSimple(index) {
    simpleEditando = subproductosSeleccionadosSimple[index];

    document.getElementById('confirmacionSimple').style.display = 'block';
    document.getElementById('productoSimple').value = simpleEditando.nombre;
    document.getElementById('cantidadSimple').value = simpleEditando.cantidad;
}


//PRODUCTOS COMPUESTOS


async function buscarSubproductoPorNombre() {
    const query = document.getElementById('buscarSubproducto').value;
    if (query.length < 3) {
        document.getElementById('resultadosBusquedaA').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`/producto/buscar?filtro=${query}`);
        const productos = await response.json();
        const listaResultados = document.getElementById('resultadosBusquedaA');
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


function mostrarFormularioSubproducto() {
    document.getElementById('formSubproducto').style.display = 'block';
    subproductoEditando = null; 
    document.getElementById('cantidadSubproducto').value = 1;
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

function cancelarAgregarSubproducto() {
    document.getElementById('formSubproducto').style.display = 'none';
    document.getElementById('buscarSubproducto').value = '';
    document.getElementById('resultadosBusqueda').style.display = 'none';
}

var idPM;
async function seleccionarProductoC(idProducto) {
    try {
        idPM = idProducto;
        const response = await fetch(`/producto-compuesto/${idProducto}`);
        if (!response.ok) throw new Error('Error al obtener el producto compuesto');

        const productoCompuesto = await response.json();
       
        subproductosSeleccionados = productoCompuesto.subproductos.map(subWrapper => ({
            id: subWrapper.subproducto.id,
            nombre: subWrapper.subproducto.nombre,
            cantidad: subWrapper.cantidad,
        }));

        actualizarListaSubproductos();

        document.getElementById('precioBaseC').focus();

    } catch (error) {
        console.error('Error al seleccionar el producto compuesto:', error);
        mostrarMensaje('Hubo un error al cargar el producto compuesto.', 'error');
    }
}

async function buscarCompuestoPorNombre() {
    const filtro = document.getElementById('buscarCompuesto').value.trim();
    const listaResultados = document.getElementById('resultadosBusquedaCompuesto');


    if (filtro.length < 3) {
        listaResultados.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`/producto-compuesto/buscar?filtro=${encodeURIComponent(filtro)}`);
        const productos = await response.json();

        listaResultados.innerHTML = '';

        if (productos.length === 0) {
            listaResultados.style.display = 'none';
            return;
        }

        productos.forEach(producto => {
            const item = document.createElement('li');
            item.textContent = producto.nombre || 'Sin nombre';
            item.setAttribute('data-id', producto.id);
            item.style.cursor = 'pointer';
            item.onclick = () => {
                seleccionarProductoC(producto.id);
                document.getElementById('nombreC').innerText = producto.nombre;
                document.getElementById('nombreC').dataset.id = producto.id;
                document.getElementById('precioBaseC').value = producto.precioBase;
                listaResultados.style.display = 'none';
                document.getElementById('confirmacionCompuesto').style.display = 'block';
                
            };
            listaResultados.appendChild(item);
        });

        listaResultados.style.display = 'block';
    } catch (error) {
        console.error('Error al filtrar productos compuestos:', error);
    }
}

async function crearProductoCompuesto() {
    const nombre = document.getElementById('nombreCompuesto').value;
    const precioBase = parseFloat(document.getElementById('precioBase').value);

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
        subproductos
    };

    try {
    
        compuestosSeleccionados.push(productoCompuesto);

        mostrarMensaje('Producto compuesto agregado a la lista correctamente.', 'success');

        document.getElementById('buscarCompuesto').value = '';
        
        console.log('Lista actual de productos compuestos:', compuestosSeleccionados);
    } catch (error) {
        mostrarMensaje('Hubo un error al agregar el producto compuesto.', 'error');
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
        btnEditar.onclick = (event) => editarSubproducto(index, event);

        btnContainer.appendChild(btnEliminar);
        btnContainer.appendChild(btnEditar);

        li.appendChild(texto);
        li.appendChild(btnContainer);

        listaSubproductos.appendChild(li);
    });
}


function eliminarSubproducto(index) {
    subproductosSeleccionados.splice(index, 1);
    actualizarListaSubproductos();
}

function editarSubproducto(index, event) {
    if (event) event.preventDefault(); 

    const subproducto = subproductosSeleccionados[index];
    document.getElementById('formSubproducto').style.display = 'block';
    document.getElementById('buscarSubproducto').value = subproducto.nombre;
    document.getElementById('cantidadSubproducto').value = subproducto.cantidad;
    document.getElementById('formSubproducto').dataset.index = index;
}


async function confirmarCompuesto() {
    const nombreSubproducto = document.getElementById('nombreC').value;
    const idSubproducto = document.getElementById('nombreC').dataset.id;
    const cantidadSubproducto = parseInt(document.getElementById('cantidadSimple').value, 10); 

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

    const indexExistente = subproductosSeleccionadosSimple.findIndex(sub => sub.nombre === subproducto.nombre);

    if (indexExistente >= 0) {
        subproductosSeleccionadosSimple[indexExistente].cantidad = cantidadSubproducto;
    } else {
        subproductosSeleccionadosSimple.push(subproducto);
    }

    actualizarListaSimple();
    document.getElementById('buscarSubproducto').value = '';
    document.getElementById('cantidadSimple').value = 1;
    document.getElementById('productoSimple').value = '';

    document.getElementById('confirmacionSimple').style.display = 'none';
}

async function crearProductoCompuesto() {
    const nombre = document.getElementById('nombreC').innerText;
    const precioBase = parseFloat(document.getElementById('precioBaseC').value);
    const id = parseInt(document.getElementById('nombreC').dataset.id);
    const cantidad = parseInt(document.getElementById('cantidadC').value);

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
        id,
        nombre,
        cantidad,
        precioBase,
        subproductos
    };

    try {
    
        compuestosSeleccionados.push(productoCompuesto);

        mostrarMensaje('Producto compuesto agregado a la lista correctamente.', 'success');

        //limpiarFormularioProductoCompuesto();
        actualizarListaCompuesto();
        document.getElementById('confirmacionCompuesto').style.display = 'none';

        console.log('Lista actual de productos compuestos:', compuestosSeleccionados);

    } catch (error) {
        mostrarMensaje('Hubo un error al agregar el producto compuesto.', 'error');
        console.log(error)
    }
}

function eliminarCompuesto(index) {
    subproductosSeleccionadosSimple.splice(index, 1);
    actualizarListaSimple(); 
}

async function cancelarCompuesto(){
    document.getElementById('confirmacionSimple').style.display = 'none';
}

function actualizarListaCompuesto() {
    const listaSubproductos = document.getElementById('listaCompuesto');
    listaSubproductos.innerHTML = '';

    compuestosSeleccionados.forEach((producto, index) => {
        const li = document.createElement('li');
        li.className = 'productoC-item';
        li.dataset.index = index;

        const texto = document.createElement('span');
        texto.textContent = `${producto.nombre} - Cantidad: ${producto.cantidad}`;
        texto.style.marginRight = '20px';

        const btnContainer = document.createElement('div');
        btnContainer.className = 'btn-container';

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn btn-danger btn-sm';
        btnEliminar.onclick = () => eliminarCompuesto(index);
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn btn-warning btn-sm';

        btnContainer.appendChild(btnEliminar);
        btnContainer.appendChild(btnEditar);

        li.appendChild(texto);
        li.appendChild(btnContainer);

        listaSubproductos.appendChild(li);
    });

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


async function crearPedido() {

    const numeroMesa = document.getElementById('mesa').value;
    const fechaPedido = document.getElementById('fecha').value;
    const estadoPedido = 'En Preparación';

    if (!numeroMesa || isNaN(parseInt(numeroMesa, 10))) {
        alert('Por favor, ingrese un número de mesa válido.');
        return;
    }

    if (!fechaPedido) {
        alert('Por favor, ingrese una fecha válida.');
        return;
    }

    if (subproductosSeleccionadosSimple.length === 0 && compuestosSeleccionados.length === 0) {
        alert('Debe agregar al menos un producto simple o compuesto al pedido.');
        return;
    }

    const pedido = {
        numeroMesa: parseInt(numeroMesa, 10),
        fechaCreacion: fechaPedido,
        estado: estadoPedido,
        productos: subproductosSeleccionadosSimple.map(sub => ({
            id: sub.id,
            tipo: 'simple',
            cantidad: sub.cantidad
        })),
        productosCompuestos: compuestosSeleccionados.map(compuesto => ({
            id: compuesto.id,
            nombre: compuesto.nombre,
            cantidad: compuesto.cantidad,
            precioBase: compuesto.precioBase,
            subproductos: compuesto.subproductos.map(sub => ({
                id: sub.subproducto.id,
                cantidad: sub.cantidad
            }))
        }))
    };

    try {
        const response = await fetch('/pedido/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        if (!response.ok) {
            throw new Error('Error al crear el pedido');
        }

        const resultado = await response.json();
        alert('Pedido creado correctamente.');
        console.log('Pedido creado:', resultado);

        limpiarFormularioPedido();
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        alert('Hubo un error al crear el pedido. Inténtelo nuevamente.');
    }
}

function limpiarFormularioPedido() {
    document.getElementById('mesa').value = '';
    document.getElementById('fecha').value = '';
    subproductosSeleccionadosSimple = [];
    compuestosSeleccionados = [];
    actualizarListaSimple();
    actualizarListaCompuesto();
}

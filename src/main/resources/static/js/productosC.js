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

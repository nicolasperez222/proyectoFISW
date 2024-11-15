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

    const response = await fetch('/producto/', {
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
}

// Crear Producto Compuesto
async function crearProductoCompuesto() {
    const nombre = document.getElementById('nombreCompuesto').value;
    const precioBase = document.getElementById('precioBase').value;
    const categoriaId = document.getElementById('categoriaIdCompuesto').value;
    
    const subproductos = [];
    document.querySelectorAll('.subproducto').forEach(row => {
        const id = row.querySelector('.subproductoId').value;
        const cantidad = row.querySelector('.subproductoCantidad').value;
        subproductos.push({ id, cantidad });
    });

    const response = await fetch('/producto-compuesto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre,
            precioBase,
            categoriaId,
            subproductos
        })
    });
    const data = await response.json();
    document.getElementById('responseMessage').innerText = response.ok ? 
        `Producto compuesto creado con ID: ${data.id}` : 'Error al crear el producto compuesto.';
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

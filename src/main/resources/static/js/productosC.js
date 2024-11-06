document.getElementById('createProductForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precioCosto = document.getElementById('precioCosto').value;
    const precioVenta = document.getElementById('precioVenta').value;

    const producto = {
        nombre: nombre,
        precioCosto: parseFloat(precioCosto),
        precioVenta: parseFloat(precioVenta)
    };

    fetch('/producto/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('responseMessage').innerText = 'Producto creado con éxito';
        document.getElementById('createProductForm').reset();
        setTimeout(() => {
            document.getElementById('responseMessage').innerText = '';
        }, 3000); 
    })
    .catch(error => {

        console.error('Error al crear el producto:', error);
        document.getElementById('responseMessage').innerText = 'Error al crear el producto';

        setTimeout(() => {
            document.getElementById('responseMessage').innerText = '';
        }, 3000);
    });
});

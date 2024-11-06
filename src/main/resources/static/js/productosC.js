document.getElementById('createProductForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const precioCosto = document.getElementById('precioCosto').value;
    const precioVenta = document.getElementById('precioVenta').value;

    // Crear un objeto producto con los valores del formulario
    const producto = {
        nombre: nombre,
        precioCosto: parseFloat(precioCosto),
        precioVenta: parseFloat(precioVenta)
    };

    // Enviar la solicitud POST al servidor
    fetch('/producto/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar mensaje de éxito
        document.getElementById('responseMessage').innerText = 'Producto creado con éxito';
        document.getElementById('createProductForm').reset();

        // Hacer que el mensaje desaparezca después de 3 segundos
        setTimeout(() => {
            document.getElementById('responseMessage').innerText = '';
        }, 3000); // 3000 milisegundos = 3 segundos
    })
    .catch(error => {
        // Mostrar mensaje de error
        console.error('Error al crear el producto:', error);
        document.getElementById('responseMessage').innerText = 'Error al crear el producto';

        // Hacer que el mensaje de error desaparezca después de 3 segundos
        setTimeout(() => {
            document.getElementById('responseMessage').innerText = '';
        }, 3000); // 3000 milisegundos = 3 segundos
    });
});

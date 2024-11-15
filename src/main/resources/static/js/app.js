

document.addEventListener('DOMContentLoaded', function() {
    fetch('/producto/')
        .then(response => response.json())
        .then(data => {
            const productosTableBody = document.getElementById('productos-table').querySelector('tbody');
            productosTableBody.innerHTML = ''; 
            
            data.forEach(producto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.precioCosto}</td>
                    <td>${producto.precioVenta}</td>
                `;
                
                productosTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
});



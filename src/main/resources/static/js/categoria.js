window.onload = function() {
    cargarCategorias();
};

// Variables para manejar el estado de la categoría a editar
let categoriaEditadaId = null;

// Creación o actualización de categoría
document.getElementById("createCategoryForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;

    const categoriaData = {
        nombre: nombre
    };

    try {
        let response;
        if (categoriaEditadaId) {
            response = await fetch(`/categoria/${categoriaEditadaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoriaData)
            });
        } else {
            response = await fetch('/categoria/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoriaData)
            });
        }

        if (response.ok) {
            const successMessage = categoriaEditadaId ? "Categoría actualizada con éxito." : "Categoría creada con éxito.";
            document.getElementById("responseMessage").textContent = successMessage;
            document.getElementById("responseMessage").style.color = "green";
            document.getElementById("createCategoryForm").reset();
            categoriaEditadaId = null;
            cargarCategorias();
            document.getElementById("submitButton").textContent = "Crear Categoría";
            document.getElementById("cancelButton").style.display = "none";
            setTimeout(() => {
                document.getElementById("responseMessage").textContent = "";
            }, 3000);
        } else {
            document.getElementById("responseMessage").textContent = "Ocurrió un error al procesar la categoría.";
            document.getElementById("responseMessage").style.color = "red";
        }
    } catch (error) {
        document.getElementById("responseMessage").textContent = "Error en la conexión con el servidor.";
        document.getElementById("responseMessage").style.color = "red";
        console.error("Error:", error);
    }
});

// Función para cargar las categorías
function cargarCategorias() {
    fetch('/categoria/')
        .then(response => response.json())
        .then(data => {
            const categoriasTable = document.getElementById('categorias-table').getElementsByTagName('tbody')[0];
            categoriasTable.innerHTML = '';
            data.forEach(categoria => {
                const row = categoriasTable.insertRow();
                row.innerHTML = `
                    <td>${categoria.id}</td>
                    <td>${categoria.nombre}</td>
                    <td>
                        <button onclick="editarCategoria(${categoria.id}, '${categoria.nombre}')">Actualizar</button>
                        <button onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Error al cargar las categorías:', error));
}

// Función para eliminar una categoría
function eliminarCategoria(id) {
    if (categoriaEditadaId !== null) {
        cancelarEdicion();
    }

    // Confirmación antes de eliminar la categoría
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
        fetch(`/categoria/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                document.getElementById("responseMessage").textContent = "Categoría eliminada con éxito.";
                document.getElementById("responseMessage").style.color = "green";
                cargarCategorias(); 
            } else {
                document.getElementById("responseMessage").textContent = "Error al eliminar la categoría.";
                document.getElementById("responseMessage").style.color = "red";
            }
        })
        .catch(error => console.error('Error al eliminar la categoría:', error));
    }
}

// Función para cancelar la edición
function cancelarEdicion() {
    document.getElementById("createCategoryForm").reset();
    document.getElementById("responseMessage").textContent = "";
    document.getElementById("submitButton").textContent = "Crear Categoría";
    document.getElementById("cancelButton").style.display = "none";
    categoriaEditadaId = null; // Restablecer la categoría editada
}

// Función para editar una categoría
function editarCategoria(id, nombre) {
    document.getElementById("nombre").value = nombre;
    document.getElementById("responseMessage").textContent = `Editando categoría: ${nombre}`;
    document.getElementById("responseMessage").style.color = "orange";
    categoriaEditadaId = id;
    document.getElementById("submitButton").textContent = "Actualizar Categoría";
    document.getElementById("cancelButton").style.display = "inline-block";
    document.getElementById("nombre").focus();
}

// Función para cancelar la edición
document.getElementById("cancelButton").addEventListener("click", function() {
    cancelarEdicion();
});

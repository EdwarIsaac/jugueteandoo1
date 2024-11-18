let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

// Cargar el archivo de sonido para eliminación
const sonidoEliminar = new Audio('assets/sounds/sonidoeliminar.mp3');

// Función para eliminar el producto del carrito
function eliminarDelCarrito(e) {
    // Reproducir sonido al eliminar producto
    sonidoEliminar.play();

    // Mostrar mensaje de "Producto eliminado"
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` o `bottom`
        position: "right", // `left`, `center` o `right`
        stopOnFocus: true, // Evita que el mensaje desaparezca al hacer hover
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // Eje horizontal
            y: '1.5rem' // Eje vertical
        },
        onClick: function() {} // Callback tras hacer clic
    }).showToast();

    // Eliminar el producto del carrito
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    // Eliminar el producto del array
    productosEnCarrito.splice(index, 1);

    // Actualizar la vista del carrito
    cargarProductosCarrito();

    // Actualizar el almacenamiento local
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}


botonVaciar.addEventListener("click", vaciarCarrito);
// Cargar el archivo de sonido para vaciar el carrito
const sonidoVaciarCarrito = new Audio('assets/sounds/sonidoeliminar.mp3');

function vaciarCarrito() {
    // Mostrar la ventana de confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        // Solo si el usuario confirma (hace clic en "Sí")
        if (result.isConfirmed) {
            // Reproducir el sonido de vaciado del carrito después de la confirmación
            sonidoVaciarCarrito.play();

            // Vaciar el carrito
            productosEnCarrito.length = 0;

            // Actualizar el almacenamiento local
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            // Actualizar la vista del carrito (mostrar carrito vacío)
            cargarProductosCarrito();
        }
    });
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    // Crear el mensaje con los detalles de los productos
    let mensaje = "Hola, estoy interesado en los siguientes productos:\n";
    productosEnCarrito.forEach(producto => {
        mensaje += `- ${producto.titulo} (Cantidad: ${producto.cantidad})\n`;
        mensaje += `  Imagen: ${producto.imagen}\n`; // Añadir el enlace de la imagen
    });

    // Codificar el mensaje para la URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Crear el enlace a WhatsApp con el mensaje
    const whatsappLink = `
        <a class="text-blue-600 text-lg font-bold" href="https://wa.me/573212440321?text=${mensajeCodificado}">
            <i class="fab fa-whatsapp"></i>
            Enviar mensaje a WhatsApp
        </a>
    `;

    // Vaciar el carrito
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    // Ocultar las secciones del carrito
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");

    // Mostrar el enlace a WhatsApp
    contenedorCarritoComprado.innerHTML = whatsappLink; // Cambiar el contenido del contenedor
    contenedorCarritoComprado.classList.remove("disabled"); // Mostrar el contenedor
}
// --- CONFIGURACIÓN ---
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRqp2ik1N-LArMAUsRpx5JfygQD_AYnz7JEaiaw4-SPEzh5fOA5OsB2qVJYQlqG0wx8V5X8VkrOIZ96/pub?output=csv';
const WHATSAPP_NUMBER = '521XXXXXXXXXX'; // ⚠️ Reemplaza con tu número de WhatsApp
const PRODUCTS_PER_PAGE = 50; // ✅ Define cuántos productos cargar cada vez
// --------------------

// --- Variables Globales para gestionar la carga ---
let allProducts = []; // Aquí guardaremos TODOS los productos del CSV
let currentIndex = 0; // Este es un contador para saber qué producto toca mostrar
const container = document.getElementById('catalogo-container');
const loadMoreContainer = document.getElementById('load-more-container');

// --- Función para mostrar un lote de productos ---
function loadMoreProducts() {
    const fragment = document.createDocumentFragment(); // Usamos un fragmento para mejorar el rendimiento
    const endIndex = Math.min(currentIndex + PRODUCTS_PER_PAGE, allProducts.length);

    for (let i = currentIndex; i < endIndex; i++) {
        const product = allProducts[i];
        if (product && product.Title && product.Title.trim() !== '') {
            
            // --- Lógica para la imagen ---
            const imageUrl = product['Image URL']; // Asegúrate que el nombre de la columna sea EXACTO
            let imageHTML = '';
            // Si hay una URL de imagen, crea la etiqueta img
            if (imageUrl && imageUrl.trim() !== '') {
                imageHTML = `<img src="${imageUrl}" alt="${product.Title}" class="product-image">`;
            }

            // --- Lógica para precios ---
            const regularPrice = parseFloat(product['Regular Price']);
            const salePrice = parseFloat(product['Sale Price']);
            let precioHTML = '';

            if (!isNaN(salePrice) && salePrice > 0 && salePrice < regularPrice) {
                precioHTML = `<span class="sale-price">${formatoMoneda(salePrice)}</span> <span class="regular-price">${formatoMoneda(regularPrice)}</span>`;
            } else if (!isNaN(regularPrice) && regularPrice > 0) {
                precioHTML = `${formatoMoneda(regularPrice)}`;
            } else {
                precioHTML = 'Consultar precio';
            }

            const mensaje = encodeURIComponent(`Hola, me interesa el producto: ${product.Title}`);
            const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;

            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            // --- Añadimos la imagen al HTML de la tarjeta ---
            productCard.innerHTML = `
                ${imageHTML}
                <h3>${product.Title}</h3>
                <div class="price">${precioHTML}</div>
                <a href="${whatsappLink}" target="_blank" class="whatsapp-button">📲 Contactar por WhatsApp</a>
            `;
            fragment.appendChild(productCard);
        }
    }

    container.appendChild(fragment); // Añadimos todos los productos del lote de una sola vez
    currentIndex = endIndex; // Actualizamos el contador

    // Ocultar el botón si ya no hay más productos que mostrar
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn && currentIndex >= allProducts.length) {
        loadMoreBtn.style.display = 'none';
    }
}

// --- Lógica Principal ---
document.addEventListener("DOMContentLoaded", () => {
    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            container.innerHTML = ''; // Limpiamos el mensaje "Cargando..."
            allProducts = results.data; // Guardamos todos los productos en nuestra variable global

            if (allProducts && allProducts.length > 0) {
                // Cargamos el primer lote de productos
                loadMoreProducts();

                // Si hay más productos de los que se muestran inicialmente, creamos el botón "Cargar más"
                if (allProducts.length > PRODUCTS_PER_PAGE) {
                    const loadMoreBtn = document.createElement('button');
                    loadMoreBtn.id = 'load-more-btn';
                    loadMoreBtn.textContent = 'Cargar más productos';
                    loadMoreBtn.onclick = loadMoreProducts;
                    loadMoreContainer.appendChild(loadMoreBtn);
                }
            } else {
                container.innerHTML = `<div style="color: red; text-align: center;">No se encontraron productos en el catálogo.</div>`;
            }
        },
        error: function(err) {
            container.innerHTML = `<div style="color: red; text-align: center;">Error al cargar el catálogo.</div>`;
            console.error("Error al leer el CSV:", err);
        }
    });
});

// --- Función auxiliar para dar formato de moneda ---
function formatoMoneda(numero) {
    if (isNaN(numero)) return '';
    return numero.toLocaleString('es-MX', { 
        style: 'currency', 
        currency: 'MXN' 
    });
}

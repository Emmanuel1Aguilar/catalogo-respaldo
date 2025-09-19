// --- CONFIGURACIÓN ---
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRqp2ik1N-LArMAUsRpx5JfygQD_AYnz7JEaiaw4-SPEzh5fOA5OsB2qVJYQlqG0wx8V5X8VkrOIZ96/pub?output=csv';
const WHATSAPP_NUMBER = '525545731973'; // ⚠️ Reemplaza con tu número de WhatsApp
// --------------------

document.addEventListener("DOMContentLoaded", () => {
    const listContainer = document.querySelector('#catalogo-completo .list');
    const loader = document.querySelector('#catalogo-completo .loader');

    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            let allProductsHTML = ''; 

            results.data.forEach(product => {
                if (product && product.Title && product.Title.trim() !== '') {
                    
                    // --- Lógica para la imagen ---
                    const imageUrlString = product['Image URL']; // Obtenemos el texto completo: "url1|url2|..."
                    let imageHTML = '';
                    
                    if (imageUrlString && imageUrlString.trim() !== '') {
                        // 👇 ¡AQUÍ ESTÁ LA MAGIA! 👇
                        // 1. Dividimos el texto por el "|" para crear una lista de URLs.
                        // 2. Tomamos solo el primer elemento de la lista con [0].
                        const firstImageUrl = imageUrlString.split('|')[0];
                        
                        // 3. Usamos esa primera URL para la etiqueta de la imagen.
                        imageHTML = `<img src="${firstImageUrl}" alt="${product.Title}" class="product-image">`;
                    }

                    const regularPrice = parseFloat(product['Regular Price']);
                    const salePrice = parseFloat(product['Sale Price']);
                    let precioHTML = 'Consultar precio';
                    if (!isNaN(salePrice) && salePrice > 0 && salePrice < regularPrice) {
                        precioHTML = `<span class="sale-price">${formatoMoneda(salePrice)}</span> <span class="regular-price">${formatoMoneda(regularPrice)}</span>`;
                    } else if (!isNaN(regularPrice) && regularPrice > 0) {
                        precioHTML = `${formatoMoneda(regularPrice)}`;
                    }

                    const mensaje = encodeURIComponent(`Hola, me interesa el producto: ${product.Title} (ID: ${product.ID})`);
                    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;

                    allProductsHTML += `
                        <div class="product-card">
                            ${imageHTML}
                            <h3 class="product-name">${product.Title}</h3>
                            <p class="product-id">ID: ${product.ID}</p>
                            <div class="price">${precioHTML}</div>
                            <a href="${whatsappLink}" target="_blank" class="whatsapp-button">📲 Contactar por WhatsApp</a>
                        </div>
                    `;
                }
            });

            loader.style.display = 'none';
            listContainer.innerHTML = allProductsHTML;

            const options = {
                valueNames: ['product-name', 'product-id']
            };
            const productList = new List('catalogo-completo', options);
        },
        error: function(err) {
            if (loader) {
                loader.innerHTML = `<div style="color: red; text-align: center;">Error al cargar el catálogo.</div>`;
            }
            console.error("Error al leer el CSV:", err);
        }
    });
});

function formatoMoneda(numero) {
    if (isNaN(numero)) return '';
    return numero.toLocaleString('es-MX', { 
        style: 'currency', 
        currency: 'MXN' 
    });
}

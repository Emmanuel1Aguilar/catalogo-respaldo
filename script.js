// --- CONFIGURACIÓN ---
const CSV_URL = 'https://raw.githubusercontent.com/Emmanuel1Aguilar/catalogo-respaldo/main/Productos-Don-Quick-Dispensario%20%20-%20Hoja%201%20(1).csv'; // ⚠️ Reemplaza esto con el enlace PÚBLICO a tu archivo CSV
const WHATSAPP_NUMBER = '+525545731973'; // ⚠️ Reemplaza con tu número de WhatsApp (código de país + número)
// --------------------

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('catalogo-container');

    Papa.parse(CSV_URL, {
        download: true,
        header: true, // ¡Importante! Usa la primera fila como nombres de columna
        complete: function(results) {
            container.innerHTML = ''; // Limpia el mensaje "Cargando..."
            
            // Recorre cada producto (fila) del CSV
            results.data.forEach(product => {
                // Se asegura de que la fila no esté vacía y tenga un título
                if (product && product.Title) {
                    
                    // --- Lógica de precios ---
                    const regularPrice = parseFloat(product['Regular Price']);
                    const salePrice = parseFloat(product['Sale Price']);
                    let precioHTML = '';

                    // Si hay un precio de oferta válido y es menor que el regular
                    if (!isNaN(salePrice) && salePrice > 0 && salePrice < regularPrice) {
                        precioHTML = `
                            <span class="sale-price">${formatoMoneda(salePrice)}</span>
                            <span class="regular-price">${formatoMoneda(regularPrice)}</span>
                        `;
                    } else {
                        precioHTML = `${formatoMoneda(regularPrice)}`;
                    }

                    // --- Construcción del Enlace de WhatsApp ---
                    const mensaje = encodeURIComponent(`Hola, me interesa el producto: ${product.Title}`);
                    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;

                    // --- Creación de la tarjeta del producto ---
                    const productCardHTML = `
                        <div class="product-card">
                            <h3>${product.Title}</h3>
                            <div class="price">${precioHTML}</div>
                            <a href="${whatsappLink}" target="_blank" class="whatsapp-button">📲 Contactar por WhatsApp</a>
                        </div>
                    `;
                    
                    container.innerHTML += productCardHTML;
                }
            });
        },
        error: function(err) {
            container.innerHTML = `<div style="color: red; text-align: center;">Error al cargar el catálogo. Por favor, intenta más tarde.</div>`;
            console.error("Error al leer el CSV:", err);
        }
    });
});

// Función auxiliar para dar formato de moneda
function formatoMoneda(numero) {
    return numero.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

}





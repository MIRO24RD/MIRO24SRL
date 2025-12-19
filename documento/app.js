
// app.js

// ... (después de la definición de ALL_PRODUCTS_DATA y funciones auxiliares)

// ===============================================
// 4. LÓGICA DE BÚSQUEDA Y FILTRO
// ===============================================

/**
 * Maneja la entrada de texto en la barra de búsqueda para filtrar productos.
 * @param {string} searchTerm - El texto ingresado por el usuario.
 */
function handleSearch(searchTerm) {
    const mainProductSection = document.getElementById("product-list"); // Contenedor original
    const searchResultsContainer = document.getElementById("search-results-container"); // NUEVO Contenedor debajo del header
    const titleSection = document.getElementById("productos-destacados-title");
    const verMasBtn = document.getElementById("ver-mas-btn");
    const categoryFilter = document.getElementById("category-filter");
    const homeSection = document.getElementById("productos-destacados"); // Sección completa original

    if (!mainProductSection || !searchResultsContainer || !titleSection || !verMasBtn || !categoryFilter || !homeSection) return;

    const term = searchTerm.toLowerCase().trim();

    if (term === "") {
        // 1. REVERTIR al estado normal (página de inicio)
        
        // Ocultar resultados de búsqueda
        searchResultsContainer.classList.add('hidden');
        searchResultsContainer.innerHTML = ''; // Limpiar

        // Mostrar sección de productos original
        homeSection.classList.remove('hidden');
        
        // Mostrar categorías y título normal
        categoryFilter.classList.remove('hidden');
        titleSection.textContent = "Nuestros Productos";
        
        // Recargar la lógica de categorías/límite por defecto
        loadHomePage(); 
        
        // Limpiar botones activos
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('bg-primary', 'text-bg-dark');
            btn.classList.add('bg-secondary', 'text-text-light');
        });
        document.querySelector('.category-btn[data-category="ALL"]').classList.add('bg-primary', 'text-bg-dark');


        return;
    }

    // 2. FILTRAR y MOSTRAR resultados de búsqueda
    
    // Ocultar la sección original de la página de inicio
    homeSection.classList.add('hidden');
    
    // Mostrar el contenedor de resultados de búsqueda
    searchResultsContainer.classList.remove('hidden');
    searchResultsContainer.innerHTML = ''; // Limpiar el contenido anterior

    // 1. Filtrar los productos
    const resultados = ALL_PRODUCTS_DATA.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );

    // 2. Renderizar los resultados
    
    // Crear el HTML de la sección de resultados dinámica
    let resultsHtml = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 class="text-3xl font-bold mb-8 text-white">Resultados para: "<span class="text-primary">${searchTerm}</span>"</h2>
            <div id="active-search-results" class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8">
    `;

    if (resultados.length === 0) {
        resultsHtml += `<p class="col-span-4 text-center py-10 text-gray-400">No se encontraron productos que coincidan con "${searchTerm}".</p>`;
    } else {
        resultsHtml += resultados.map(renderProductCard).join('');
    }
    
    resultsHtml += `
            </div>
        </div>
    `;

    searchResultsContainer.innerHTML = resultsHtml;
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}


// ----------------------------------------------------
// CÓDIGO RESTANTE SIN CAMBIOS
// ----------------------------------------------------

// ... (El resto del código como initApp, loadHomePage, setupAuthFormListeners, etc. permanece igual)
function initApp() {
    // Inicializar Firebase
    try {
        if (firebaseConfig.projectId && firebaseConfig.projectId !== "tu-project-id") {
             firebase.initializeApp(firebaseConfig);
             auth = firebase.auth();
             db = firebase.firestore(); 
             
             auth.onAuthStateChanged(updateAuthUI);
             
             console.log("Firebase inicializado correctamente.");
        } else {
            console.error("Firebase no configurado. Las funciones de autenticación y pago NO funcionarán.");
        }
    } catch (error) {
         console.error("Error al inicializar Firebase:", error);
    }
    
    const pageId = document.body.id;
    if (pageId === 'home-page') {
        loadHomePage(); // Carga inicial de productos con límite y eventos de categoría
        
    } else if (pageId === 'product-detail-page') { 
        loadProductDetailPage(); 
    } 

    initEventListeners();
    setupAuthFormListeners(); 
    updateCartDisplay(); 
}

document.addEventListener('DOMContentLoaded', initApp);


// ** IMPORTANTE: REEMPLAZA ESTO CON TUS CREDENCIALES REALES DE FIREBASE **
const firebaseConfig = {
apiKey: "AIzaSyCVZxoeyoL2oMGsOKO_cAxKxaRzDj48bao",
    authDomain: "miro24-c1c87.firebaseapp.com",
    projectId: "miro24-c1c87",
    storageBucket: "miro24-c1c87.firebaseapp.com",
    messagingSenderId: "144971894925",
    appId: "1:144971894925:web:11610fbf4d80803e0f92c4",
    measurementId: "G-9DZR3JQ2XP"
};

let db;
let auth;

// Límite de productos a mostrar inicialmente (NUEVO)
const INITIAL_PRODUCT_LIMIT = 8; 

// Datos de productos (Ejemplo)
const ALL_PRODUCTS_DATA = [


 
{ id: 'TL-SG1005D', name: 'Switch TP-Link TL-SG1005D Gigabit 5 Puertos', category: 'REDES', price: 2100.00, image: 'https://tse2.mm.bing.net/th/id/OIP.O3lnY9y7_SwkGiTYb3pFQQHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch Gigabit de 5 puertos ideal para redes domésticas y oficinas pequeñas.', featured: false, new: false, details: 'Plug & Play, bajo consumo.' },
{ id: 'TL-SG1008', name: 'Switch TP-Link TL-SG1008 Gigabit 8 Puertos', category: 'REDES', price: 2900.00, image: 'https://tse3.mm.bing.net/th/id/OIP.efcPsh29ujCkp8mwd8uoEAHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch Gigabit de 8 puertos para mayor velocidad de red.', featured: true, new: false, details: 'Carcasa metálica.' },
{ id: 'TL-SG1016D', name: 'Switch TP-Link TL-SG1016D Gigabit 16 Puertos', category: 'REDES', price: 5200.00, image: 'https://tse3.mm.bing.net/th/id/OIP.88HSaMnbyvcmETHJTwLg7wHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch Gigabit de 16 puertos para empresas y oficinas.', featured: true, new: false, details: 'Rackeable, alto rendimiento.' },
{ id: 'TP-Link TL-SF1005D', name: 'Switch TP-Link TL-SF1005D Fast Ethernet 5 Puertos', category: 'REDES', price: 720.00, image: 'https://ruperhat.com/wp-content/uploads/2020/06/TP-Link-TL-SF1005D-5-Port-10-100Mbps-Desktop-Switch.jpg', description: 'Switch Fast Ethernet compacto para uso básico.', featured: false, new: false, details: 'Diseño compacto.' },
{ id: 'TP-Link TL-SF1008D', name: 'Switch TP-Link TL-SF1008D Fast Ethernet 8 Puertos', category: 'REDES', price: 950.00, image: 'https://tse4.mm.bing.net/th/id/OIP.u7BpL4KMoMPlrdz-MDuQVwHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch Fast Ethernet de 8 puertos para redes pequeñas.', featured: false, new: false, details: 'Tecnología Green.' },
{ id: 'TP-Link TL-SF1016D', name: 'Switch TP-Link TL-SF1016D Fast Ethernet 16 Puertos', category: 'REDES', price: 2800.00, image: 'https://tse4.mm.bing.net/th/id/OIP.I977NU0IjuGiiNdAIDzEXAHaEY?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch de 16 puertos para oficinas.', featured: false, new: false, details: 'Plug & Play.' },
{ id: 'MS105', name: 'Switch Mercusys MS105 Fast Ethernet 5 Puertos', category: 'REDES', price: 680.00, image: 'https://www.netgear.com/zone3/cid/fit/1024x633/to/jpg/https/www.netgear.com/in/media/MS105_wShadow_Right_15Mar22-PC-NEW_tcm165-144575.png', description: 'Switch Mercusys de 5 puertos 10/100 Mbps.', featured: false, new: true, details: 'Silencioso.' },
{ id: 'MS108', name: 'Switch Mercusys MS108 Fast Ethernet 8 Puertos', category: 'REDES', price: 850.00, image: 'https://static.mercusys.com/product-image/localTest_MS108_EU_2.0_06_large20200513063949.jpg', description: 'Switch Mercusys de 8 puertos para redes básicas.', featured: false, new: false, details: 'Bajo consumo.' },
{ id: 'MS108G', name: 'Switch Mercusys MS108G Gigabit 8 Puertos', category: 'REDES', price: 1650.00, image: 'https://th.bing.com/th/id/R.329e207e31bb5aeea063540944665c30?rik=k3bO08nmNrDz8g&pid=ImgRaw&r=0', description: 'Switch Gigabit de 8 puertos para transferencias rápidas.', featured: true, new: true, details: 'Carcasa metálica.' },
{ id: 'MS105G', name: 'Switch Mercusys MS105G Gigabit 5 Puertos', category: 'REDES', price: 1350.00, image: 'https://static.mercusys.com/product-image/MS105G_EU_2.0_02_large20210806100001.jpg', description: 'Switch Gigabit compacto de 5 puertos.', featured: false, new: true, details: 'Diseño compacto.' },
{ id: 'TP-Link TL-SG105', name: 'Switch TP-Link TL-SG105 Gigabit 5 Puertos', category: 'REDES', price: 2100.00, image: 'https://tse1.mm.bing.net/th/id/OIP.fNKWFe0wS4Y4Ae-Nhqv2CgHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch Gigabit confiable para alto rendimiento.', featured: true, new: false, details: 'QoS, Green Ethernet.' },
{ id: 'TP-Link TL-SG108', name: 'Switch TP-Link TL-SG108 Gigabit 8 Puertos', category: 'REDES', price: 3300.00, image: 'https://tse1.mm.bing.net/th/id/OIP.6JKTqM7pQoWKoi8xfZcx1gHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch Gigabit con carcasa metálica y alto desempeño.', featured: true, new: false, details: 'Diseño robusto.' },
{ id: 'TP-Link TL-SF1005P', name: 'Switch TP-Link TL-SF1005P Fast Ethernet PoE 5 Puertos', category: 'REDES', price: 3150.00, image: 'https://tse3.mm.bing.net/th/id/OIP.UR7aIlqPgkweaDQvWXP6iwHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch PoE para cámaras IP y puntos de acceso.', featured: true, new: true, details: 'PoE hasta 65W.' },
{ id: 'TP-Link TL-SG105PE', name: 'Switch TP-Link TL-SG105PE Gigabit Easy Smart PoE', category: 'REDES', price: 4600.00, image: 'https://tse4.mm.bing.net/th/id/OIP.G5Rt3ALCd0tPZowm0zY-JAHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch Easy Smart con soporte PoE.', featured: true, new: true, details: 'VLAN, QoS.' },
{ id: 'TP-Link JetStream SG2210P', name: 'Switch TP-Link JetStream SG2210P PoE Administrable', category: 'REDES', price: 18500.00, image: 'https://tse4.mm.bing.net/th/id/OIP.t8ZVBCOrShKfWPCelSOydwHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch administrable PoE para empresas.', featured: true, new: false, details: 'L2, rackeable.' },
{ id: 'TP-Link JetStream SG2428P', name: 'Switch TP-Link JetStream SG2428P PoE 28 Puertos', category: 'REDES', price: 48500.00, image: 'https://tse1.mm.bing.net/th/id/OIP.AFSnEBigJPRIv0nMRojXRQHaII?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch PoE administrable para despliegues grandes.', featured: true, new: true, details: 'L2+, 24 puertos PoE.' },
{ id: 'SG200-26FP-NA', name: 'Switch Cisco Small Business 24 Puertos Gigabit', category: 'REDES', price: 52000.00, image: 'https://www.compufix.ie/wp-content/uploads/2024/09/2w-an-8-port-layer-2-poe-switch-supporting-silent-fanless-cooling.jpg', description: 'Switch Cisco para redes empresariales.', featured: true, new: false, details: 'Alta confiabilidad.' },
{ id: 'CRS326-24G-2S+IN', name: 'Switch Ubiquiti UniFi Switch Lite 8 PoE', category: 'REDES', price: 14800.00, image: 'https://img.pccomponentes.com/articles/37/374279/2656-mikrotik-crs326-24g-2s-in-switch-24-puertos-gigabit-2-puertos-sfp-comprar.jpg', description: 'Switch UniFi con administración centralizada.', featured: true, new: true, details: 'Integración UniFi.' },
{ id: 'sw-019', name: 'Switch MikroTik CRS326 Gigabit 24 Puertos', category: 'REDES', price: 29500.00, image: 'https://i.mt.lv/cdn/rb_images/1940_hi_res.png', description: 'Switch MikroTik administrable de alto rendimiento.', featured: true, new: false, details: 'RouterOS.' },
{ id: 'sw-020', name: 'Switch D-Link DGS-1024D Gigabit 24 Puertos', category: 'REDES', price: 17500.00, image: 'https://tse3.mm.bing.net/th/id/OIP._-N7bw6mRlPuwDFq4MmfrgHaEK?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch Gigabit de 24 puertos para oficinas.', featured: false, new: false, details: 'Plug & Play.' },

{ id: 'TL-WR840N', name: 'Router TP-Link TL-WR840N Wireless N300', category: 'REDES', price: 1650.00, image: 'https://tse4.mm.bing.net/th/id/OIP.9ITKEcm5SMPRvR7daGdEKAHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router inalámbrico N300 ideal para hogares y pequeñas oficinas.', featured: false, new: false, details: '300Mbps, 2 antenas.' },
{ id: 'rt-002', name: 'Router TP-Link Archer C6 AC1200', category: 'REDES', price: 3200.00, image: 'https://tse4.mm.bing.net/th/id/OIP.cVuYERfRsZupzBlowm6fIAHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router doble banda AC1200 para streaming y juegos.', featured: true, new: false, details: 'Wi-Fi 5, MU-MIMO.' },
{ id: 'AX1500', name: 'Router TP-Link Archer AX10 Wi-Fi 6 AX1500', category: 'REDES', price: 5200.00, image: 'https://tse4.mm.bing.net/th/id/OIP.rzXGhBBBkuuydhKpURxS0AHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router Wi-Fi 6 para redes modernas de alta velocidad.', featured: true, new: true, details: 'AX1500, OFDMA.' },
{ id: 'AX5400', name: 'Router TP-Link Archer AX73 Wi-Fi 6 AX5400', category: 'REDES', price: 11200.00, image: 'https://tse4.mm.bing.net/th/id/OIP.vllUMxDzhzQirrSh8YebCgHaE8?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router Wi-Fi 6 de alto rendimiento para hogares grandes.', featured: true, new: true, details: '6 antenas, alto alcance.' },
{ id: 'MW305R', name: 'Router Mercusys MW305R Wireless N300', category: 'REDES', price: 1250.00, image: 'https://static.mercusys.com/product-image/localTest_MW305R2.0(EU)_1906_02_large20200513090024.jpg', description: 'Router económico para conexión básica a Internet.', featured: false, new: false, details: '300Mbps, fácil configuración.' },
{ id: 'AC12G AC1200', name: 'Router Mercusys AC12G AC1200', category: 'REDES', price: 2950.00, image: 'https://static.mercusys.com/product-image/localTest_AC12G_EU_1.0_01_large20200513031709.jpg', description: 'Router doble banda con puertos Gigabit.', featured: true, new: false, details: 'AC1200, control parental.' },
{ id: '6 AX1800', name: 'Router ASUS RT-AX55 Wi-Fi 6 AX1800', category: 'REDES', price: 7900.00, image: 'https://tse2.mm.bing.net/th/id/OIP.h5wcl6QEPb0nH2k1IF68bQHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router ASUS Wi-Fi 6 con alto rendimiento y seguridad.', featured: true, new: true, details: 'AiProtection, AX1800.' },
{ id: 'AC68U', name: 'Router ASUS RT-AC68U AC1900', category: 'REDES', price: 8600.00, image: 'https://dlcdnwebimgs.asus.com/gain/847005b6-c20c-41a9-bb33-bdaa695c71ec/', description: 'Router AC1900 para redes exigentes.', featured: true, new: false, details: 'Beamforming.' },
{ id: 'rt-009', name: 'Router MikroTik hAP ac² Dual Band', category: 'REDES', price: 5400.00, image: 'https://i.mt.lv/cdn/rb_images/1468_hi_res.png', description: 'Router MikroTik para usuarios avanzados.', featured: false, new: false, details: 'RouterOS, configurable.' },
{ id: 'RB750Gr3', name: 'Router MikroTik RB750Gr3 hEX', category: 'REDES', price: 4200.00, image: 'https://tse3.mm.bing.net/th/id/OIP.zZgHq2I9iHG4ol0OG7fhaQHaEt?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router cableado de alto rendimiento.', featured: false, new: false, details: '5 puertos Gigabit.' },
{ id: 'MIPS1004Kc', name: 'Router Ubiquiti EdgeRouter X', category: 'REDES', price: 6200.00, image: 'https://www.kjell.com/globalassets/productimages/477357_61432.tif?ref=5D1F8B0474&format=jpg', description: 'Router profesional para redes avanzadas.', featured: true, new: false, details: 'QoS, VLAN.' },
{ id: 'rt-012', name: 'Router Ubiquiti UniFi Dream Router', category: 'REDES', price: 14500.00, image: 'https://youget.pt/118356-large_default/router-ubiquiti-unifi-dream-udr-wifi6-2xpoe-branco.jpg', description: 'Router todo-en-uno con gestión UniFi.', featured: true, new: true, details: 'Wi-Fi 6, controlador integrado.' },
{ id: 'RV340-K9-G5', name: 'Router Cisco RV340 Dual WAN', category: 'REDES', price: 28500.00, image: 'https://m.media-amazon.com/images/I/812QVYmohJL._AC_SL1500_.jpg', description: 'Router empresarial Cisco con seguridad avanzada.', featured: true, new: false, details: 'Firewall, VPN.' },
{ id: 'AC1200', name: 'Router D-Link DIR-825 AC1200', category: 'REDES', price: 3100.00, image: 'https://tse4.mm.bing.net/th/id/OIP.Dh6WqWemiNFueEjgpuYkHQHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router AC1200 confiable para el hogar.', featured: false, new: false, details: 'Doble banda.' },
{ id: 'AC1200', name: 'Router D-Link DIR-842 AC1200', category: 'REDES', price: 3400.00, image: 'https://tse4.mm.bing.net/th/id/OIP.Dh6WqWemiNFueEjgpuYkHQHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router AC1200 con mejor cobertura.', featured: false, new: false, details: 'QoS integrado.' },
{ id: 'AX3000', name: 'Router Huawei AX3 Wi-Fi 6 AX3000', category: 'REDES', price: 5800.00, image: 'https://tse3.mm.bing.net/th/id/OIP.EoP54UJs50fGl-bxXLixtQHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router Wi-Fi 6 con alta velocidad y estabilidad.', featured: true, new: true, details: 'HarmonyOS, AX3000.' },
{ id: 'AC1200', name: 'Router Huawei WS5200 AC1200', category: 'REDES', price: 2950.00, image: 'https://conectica.ro/fisiere/produse/popup/1/1292_normal_2_20160506104407.jpg', description: 'Router doble banda para uso doméstico.', featured: false, new: false, details: 'Diseño moderno.' },
{ id: 'AC1200', name: 'Router Tenda AC10 AC1200', category: 'REDES', price: 2600.00, image: 'https://tse3.mm.bing.net/th/id/OIP.f2gFk3e6SHAjq9U63zr4zgHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router económico AC1200 para hogares.', featured: false, new: false, details: '4 antenas.' },
{ id: 'AX1500', name: 'Router Tenda AX1500 Wi-Fi 6', category: 'REDES', price: 4500.00, image: 'https://tse4.mm.bing.net/th/id/OIP.sgcrHcaJq51spI7k4LdLTgHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router Wi-Fi 6 accesible y potente.', featured: true, new: true, details: 'AX1500, baja latencia.' },
{ id: 'rt-020', name: 'Router Zyxel Armor G1 Gaming AC2600', category: 'REDES', price: 13500.00, image: 'https://tse1.mm.bing.net/th/id/OIP.8PthAMXhwMygBRW96iRMxgHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Router gaming de alto rendimiento.', featured: true, new: false, details: 'Optimización para juegos.' },

  { id: 'ds-7616ni-q2-16p', name: 'NVR Hikvision AcuSense 16 Canales 4K', category: 'laptops', price: 11420.63, image: 'https://www.venprotech.com/wp-content/uploads/2025/01/iDS-7216HQHI-M2XT-480x480.png', description: 'NVR Hikvision serie Q con tecnología AcuSense y soporte hasta 4K.', featured: true, new: false, details: '16 Canales PoE, 2 SATA hasta 10TB, Salida HDMI 4K.' },
  { id: 'ds-9664ni-i8', name: 'NVR Hikvision 64 Canales 8K', category: 'SEGURIDAD', price: 138384.44, image: 'https://th.bing.com/th/id/R.3cc93803ee5f8627bf774020f43e2d90?rik=aFFJHUEwupibjA&pid=ImgRaw&r=0', description: 'NVR profesional para 64 cámaras con salida 8K y 8 bahías de disco duro.', featured: true, new: true, details: 'Soporta RAID 0, 1, 5, 10, Doble salida HDMI.' },
  { id: 'ds-2cd1063g2-liu', name: 'Cámara Hikvision IP 6MP Smart Hybrid Light', category: 'SEGURIDAD', price: 5346.76, image: 'https://shopdelta.eu/shop_image/product/ds-2cd1063g2-liu_2.8mm__d.jpg', description: 'Cámara bala con tecnología híbrida de luz blanca e infrarrojo.', featured: false, new: true, details: '6MP, IP67, Detección de personas y vehículos.' },
  { id: 'tapo-c210', name: 'Cámara TP-Link Tapo C210 360° 2K', category: 'SEGURIDAD', price: 2023.94, image: 'https://tse4.mm.bing.net/th/id/OIP.a61_wIuQiBQhp6XEvuV-RAHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Cámara Wi-Fi con movimiento horizontal y vertical para interiores.', featured: false, new: false, details: 'Resolución 3MP, Audio bidireccional, Slot MicroSD.' },
  { id: 'cs-h3c-r100', name: 'Cámara Ezviz H3c 2K Bullet Outdoor', category: 'SEGURIDAD', price: 3340.29, image: 'https://ezvizstore.cl/wp-content/uploads/2023/06/h3c-2k.png', description: 'Cámara exterior inteligente con defensa activa y visión nocturna.', featured: true, new: false, details: '2K, Wi-Fi 2.4GHz, IP67, Soporta MicroSD 512GB.' },
  { id: 'nhc-i710', name: 'Cámara Nexxt Wireless Smart 2K', category: 'SEGURIDAD', price: 2594.71, image: 'https://thotcomputacion.com.uy/wp-content/uploads/2023/09/nhc-i710-2pk-carrusel_192906_6cf2c3ae001747f4ab599927953534e7.jpg', description: 'Cámara inalámbrica fija para automatización del hogar con visión nocturna.', featured: false, new: false, details: '2K, Alerta por App, Grabación en la nube.' },
  { id: 'ds-7208hqhi-k1', name: 'DVR Hikvision AcuSense 8 Canales 5MP', category: 'SEGURIDAD', price: 5990.27, image: 'https://aacgroup.com.my/uploads/product_img/l/DS-7208HQHI-K1S.jpg', description: 'Grabador digital Turbo HD con tecnología de detección humana avanzada.', featured: false, new: false, details: '8 Canales, H.265 Pro+, Soporta 1 HDD hasta 10TB.' },
  { id: 'ds-7608ni-q1-8p', name: 'NVR Hikvision 8 Canales 4K 8 PoE', category: 'SEGURIDAD', price: 11105.39, image: 'https://aacgroup.com.my/uploads/product_img/l/DS-7608NI-Q1_8P.jpg', description: 'NVR de 8 puertos PoE plug and play con resolución 4K.', featured: true, new: false, details: '8MP, 8 puertos PoE, Salida HDMI/VGA.' },
  { id: 'cs-x5s-8w', name: 'NVR Ezviz X5S Inalámbrico 8 Canales', category: 'SEGURIDAD', price: 3455.34, image: 'https://www.sevecu.com/images/stories/virtuemart/product/20210920214727_detalle3.png', description: 'Grabador de video en red inalámbrico para cámaras EZVIZ.', featured: false, new: false, details: 'Wi-Fi 2.4GHz/5GHz, Soporta cámaras de 5MP.' },
  { id: 'hp-400-g9-sff-i7', name: 'Computadora HP ProDesk 400 G9 i7-14700', category: 'COMPUTADORAS', price: 5264.50, image: 'https://th.bing.com/th/id/R.691d191a100edfaed50bda2807363214?rik=mR6Wbu8bbKn2VA&riu=http%3a%2f%2felnstore.com%2fcdn%2fshop%2fproducts%2fHP-Pro-400-G9-SFF-6M0G0PA_1200x1200.webp%3fv%3d1670869807&ehk=t3Zgbo4DAenhSCHHK2zDT0UIH%2fq3RPzdQNkDkYHsX2M%3d&risl=&pid=ImgRaw&r=0', description: 'Computadora compacta de alto rendimiento para oficina avanzada.', featured: true, new: true, details: 'i7-14700, 16GB RAM, 512GB SSD, Windows 11 Pro.' },
  { id: 'dell-7060-mff-ref', name: 'Micro Dell OptiPlex 7060 MFF Refurbished', category: 'COMPUTADORAS', price: 20391.46, image: 'https://sis.omega.com.do/ProductImages/22b6af2b-d5bc-4a41-8c9b-92ec5e8b2bb5.png', description: 'Mini PC potente reacondicionada para ahorro de espacio.', featured: false, new: false, details: 'Intel i5 8va gen, 8GB RAM, 256GB SSD.' },
  { id: 'aoc-24g4e-gaming', name: 'Monitor AOC 24 Gaming 180Hz Fast IPS', category: 'COMPUTADORAS', price: 11722.97, image: 'https://mmd-aoc2.oss-cn-hongkong.aliyuncs.com/Products/Monitors/G%20Line/G4/24G4E/24G4E_FTR.png', description: 'Monitor gaming ultra rápido con tasa de refresco de 180Hz.', featured: true, new: true, details: '24 pulgadas, 0.5ms, HDR10, HDMI/DP.' },
  { id: 'ls24dg300-g3', name: 'Monitor Samsung Odyssey G3 24 180Hz', category: 'COMPUTADORAS', price: 10277.97, image: 'https://images.samsung.com/is/image/samsung/p6pim/hk_en/ls24dg302ecxxk/gallery/hk-en-odyssey-g3-g30d-ls24dg302ecxxk-542792887?$650_519_PNG$', description: 'Monitor gaming con diseño sin bordes y FreeSync Premium.', featured: true, new: false, details: 'Full HD, 1ms, Ajuste de altura y rotación.' },
  { id: 'logi-g502-hero', name: 'Mouse Logitech G502 Gaming Hero', category: 'ACCESORIOS', price: 2346.25, image: 'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g502-hero/g502-hero-gallery-1.png', description: 'El mouse gaming más vendido con sensor Hero 25K.', featured: true, new: false, details: '11 botones programables, Pesas ajustables, RGB.' },
  { id: 'wd20purz-purple', name: 'Disco Duro WD Purple 2TB Vigilancia', category: 'ACCESORIOS', price: 7500.00, image: 'https://pcalpormayor.com.pe/wp-content/uploads/2021/05/Disco-Duro-Western-Digital-Purple-2tb-WD20PURZ_3-1024x1024.jpg', description: 'Disco duro optimizado para grabación continua 24/7 en seguridad.', featured: false, new: false, details: 'SATA 6Gb/s, 5400 RPM, AllFrame Technology.' },
  { id: 'dh-vto2202f-p', name: 'Intercomunicador IP Dahua PoE HD', category: 'SEGURIDAD', price: 14250.00, image: 'https://www.itplus.co.nz/wp-content/uploads/2023/09/VTO2202F-P-1.png', description: 'Estación exterior de videoportero IP con cámara de 2MP.', featured: false, new: false, details: 'Carcasa de aluminio, IK07, IP65, PoE.' },
{ id: 'uac-p112-af40-w', name: 'CAMARA UNIVIEW DOMO-PT 2MP 4', category: 'SEGURIDAD', price: 2100.00, image: 'https://elmotaheda-group.com/wp-content/uploads/2024/11/20240912_1912782_0235C70J-FR_1003683_651984_0.png', description: 'CAMARA UNIVIEW DOMO-PT 2MP 4,0MM 30M OSD DWDR COLORHUNTER-AUDIO- IP66 UAC-P112-AF40-W', featured: false, new: false, details: 'Plug & Play, bajo consumo.' },   

    
{ id: 'pro-b760m-e-ddr4', name: 'Placa Madre MSI PRO B760M-E DDR4', category: 'COMPUTADORAS', price: 6890.00, image: 'https://asset.msi.com/resize/image/global/product/product_1672736801349ca87e1c2655f69918ed4c932c4820.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png', description: 'Placa madre MSI PRO B760M-E compatible con procesadores Intel, soporte DDR4 y formato micro-ATX.', featured: true, new: true, details: 'Socket LGA1700, PCIe 4.0, USB 3.2.' },
{ id: 'tl-sf1008d', name: 'Switch TP-Link TL-SF1008D Fast Ethernet 8 Puertos', category: 'REDES', price: 950.00, image: 'https://tse2.mm.bing.net/th/id/OIP.6mCEAn55_jtP7nWPJGZ_owHaJk?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch TP-Link Fast Ethernet de 8 puertos 10/100 Mbps, ideal para redes pequeñas.', featured: false, new: false, details: 'Plug & Play, carcasa plástica, bajo consumo.' },
{ id: 'tl-sf1005d', name: 'Switch TP-Link TL-SF1005D Fast Ethernet 5 Puertos', category: 'REDES', price: 720.00, image: 'https://tse3.mm.bing.net/th/id/OIP.8Lvwv1lDEJj0wmkpoKe9kgHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch TP-Link de 5 puertos Fast Ethernet para conexión estable y sencilla.', featured: false, new: false, details: 'Tecnología Green Ethernet, diseño compacto.' },
{ id: 'ms105', name: 'Switch Mercusys MS105 Fast Ethernet 5 Puertos', category: 'REDES', price: 680.00, image: 'https://www.netgear.com/zone3/cid/fit/1024x633/to/jpg/https/www.netgear.com/in/media/MS105_wShadow_Right_15Mar22-PC-NEW_tcm165-144575.png', description: 'Switch Mercusys de 5 puertos 10/100 Mbps para uso doméstico u oficina.', featured: false, new: true, details: 'Instalación rápida, funcionamiento silencioso.' },
{ id: 'ms108g', name: 'Switch Mercusys MS108G Gigabit 8 Puertos', category: 'REDES', price: 1650.00, image: 'https://static.mercusys.com/product-image/localTest_MS108G_EU_1.0_01_large20200513065422.jpg', description: 'Switch Mercusys Gigabit de 8 puertos para transferencias rápidas y estables.', featured: true, new: true, details: 'Puertos 10/100/1000 Mbps, carcasa metálica.' },
{ id: 'tl-sg105', name: 'Switch TP-Link TL-SG105 Gigabit 5 Puertos', category: 'REDES', price: 2100.00, image: 'https://tse4.mm.bing.net/th/id/OIP.9792l3TmXZonls09Xrb8vAHaEP?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch TP-Link Gigabit de 5 puertos para alto rendimiento en red.', featured: true, new: false, details: 'QoS, tecnología Green, carcasa metálica.' },
{ id: 'ms105g', name: 'Switch Mercusys MS105G Gigabit 5 Puertos', category: 'REDES', price: 1350.00, image: 'https://tse2.mm.bing.net/th/id/OIP.FpILptEuOhHNOuuQ6F0OiAHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch Mercusys Gigabit de 5 puertos para conexiones rápidas y confiables.', featured: false, new: true, details: 'Diseño compacto, bajo consumo energético.' },
{ id: 'tl-sg1016d', name: 'Switch TP-Link TL-SG1016D Gigabit 16 Puertos', category: 'REDES', price: 5200.00, image: 'https://tse4.mm.bing.net/th/id/OIP.1-Kkh55ZPIdlhW3I6jcE5wHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch TP-Link Gigabit de 16 puertos ideal para empresas y oficinas.', featured: true, new: false, details: 'Rackeable, alta capacidad de switching.' },
{ id: 'tl-sg1008', name: 'Switch TP-Link TL-SG1008 Gigabit 8 Puertos', category: 'REDES', price: 2900.00, image: 'https://tse3.mm.bing.net/th/id/OIP.efcPsh29ujCkp8mwd8uoEAHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch TP-Link Gigabit de 8 puertos para redes de alto desempeño.', featured: false, new: false, details: 'Carcasa metálica, instalación sencilla.' },
{ id: 'tl-sf1005p', name: 'Switch TP-Link TL-SF1005P Fast Ethernet PoE 5 Puertos', category: 'REDES', price: 3150.00, image: 'https://tse1.mm.bing.net/th/id/OIP.-cK2ZXxFUex6-6VBwof-XwHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch TP-Link Fast Ethernet con 4 puertos PoE para cámaras IP y puntos de acceso.', featured: true, new: true, details: 'Soporte PoE hasta 65W, ideal para CCTV.' },
{ id: 'tl-sg105pe', name: 'Switch TP-Link TL-SG105PE Gigabit Easy Smart PoE 5 Puertos', category: 'REDES', price: 4600.00, image: 'https://tse4.mm.bing.net/th/id/OIP.G5Rt3ALCd0tPZowm0zY-JAHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3g', description: 'Switch TP-Link Gigabit Easy Smart con 4 puertos PoE para administración básica de red.', featured: true, new: true, details: 'PoE hasta 65W, VLAN, QoS, carcasa metálica.' },
{ id: 'uh400', name: 'Hub USB TP-Link UH400 4 Puertos USB 3.0', category: 'ACCESORIOS', price: 1850.00, image: 'https://tse1.mm.bing.net/th/id/OIP.wseZYD3xZknnUXmWUK_dQAHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Hub USB TP-Link de 4 puertos USB 3.0 para expansión de conectividad en PC y laptops.', featured: false, new: false, details: 'Velocidad hasta 5Gbps, diseño compacto.' },
{ id: 'tl-sf1016d', name: 'Switch TP-Link TL-SF1016D Fast Ethernet 16 Puertos', category: 'REDES', price: 2800.00, image: 'https://th.bing.com/th/id/R.e301d07120895d36a383469373b5f0c4?rik=rvnoU4YclN%2b3WQ&pid=ImgRaw&r=0', description: 'Switch TP-Link Fast Ethernet de 16 puertos ideal para oficinas y pequeñas empresas.', featured: false, new: false, details: 'Instalación Plug & Play, bajo consumo.' },
{ id: 'sg2428p', name: 'Switch TP-Link JetStream SG2428P Gigabit L2 PoE 28 Puertos', category: 'REDES', price: 48500.00, image: 'https://image.makewebcdn.com/makeweb/m_1920x0/wukOUBV0V/PRODUCT24/SG2428P__5_.jpg', description: 'Switch administrable TP-Link JetStream con 24 puertos Gigabit PoE y 4 SFP.', featured: true, new: true, details: 'PoE+, administración L2, montaje en rack.' },
{ id: 'nsw-n801g', name: 'Switch NSW-N801G Gigabit 8 Puertos', category: 'REDES', price: 1950.00, image: 'https://tse2.mm.bing.net/th/id/OIP.kGO24Uus2tImqpT7AffGJQAAAA?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch Gigabit de 8 puertos para redes domésticas y de oficina.', featured: false, new: false, details: 'Plug & Play, diseño compacto.' },
{ id: 'sg3452', name: 'Switch TP-Link JetStream SG3452 Gigabit L2+ 52 Puertos', category: 'REDES', price: 82000.00, image: 'https://tse4.mm.bing.net/th/id/OIP.1R6acEvEg3IjOLiBZiGF8AHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Switch administrable TP-Link JetStream con 48 puertos Gigabit y 4 SFP+.', featured: true, new: false, details: 'L2+, routing estático, rackeable.' },
{ id: 'sm311ls', name: 'Módulo SFP TP-Link SM311LS Monomodo LC', category: 'REDES', price: 3200.00, image: 'https://tse2.mm.bing.net/th/id/OIP.CCJixZmjlRMdCT-PBE0jiQHaFj?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Módulo SFP monomodo TP-Link para enlaces de fibra óptica de larga distancia.', featured: false, new: false, details: 'Hasta 20km, conector LC.' },
{ id: 'ms110p', name: 'Switch Mercusys MS110P Fast Ethernet PoE 10 Puertos', category: 'REDES', price: 4100.00, image: 'https://static.mercusys.com/product-image/MS110P_overview_02_large20230116023849.jpg', description: 'Switch Mercusys con 8 puertos PoE para cámaras IP y dispositivos de red.', featured: true, new: true, details: 'PoE hasta 65W, ideal para CCTV.' },
{ id: 'ms108', name: 'Switch Mercusys MS108 Fast Ethernet 8 Puertos', category: 'REDES', price: 850.00, image: 'https://static.mercusys.com/product-image/localTest_MS108_EU_2.0_01_large20200513064153.jpg', description: 'Switch Mercusys de 8 puertos 10/100 Mbps para redes básicas.', featured: false, new: false, details: 'Funcionamiento silencioso, bajo consumo.' },
{ id: 'archer-t3u-plus', name: 'Adaptador USB Wi-Fi TP-Link Archer T3U Plus AC1300', category: 'REDES', price: 2150.00, image: 'https://tse3.mm.bing.net/th/id/OIP.f27pQO6ZtoXkNvIdEsSyqgHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Adaptador USB Wi-Fi TP-Link de doble banda AC1300 con antena de alta ganancia.', featured: true, new: true, details: 'Wi-Fi 5, antena ajustable, USB 3.0.' },


{ id: '81vu00d6us', name: 'Laptop Lenovo IdeaPad 3 15ITL6 Intel Core i5', category: 'COMPUTADORAS', price: 32500.00, image: 'https://tse4.mm.bing.net/th/id/OIP.GDrTMbrAQw6qIUCEQTafhQHaHE?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Laptop Lenovo IdeaPad con procesador Intel Core i5, ideal para trabajo y estudio.', featured: true, new: true, details: 'Pantalla 15.6", SSD, diseño delgado.' },
{ id: '03m07', name: 'Mouse Óptico USB Dell 03M07', category: 'ACCESORIOS', price: 450.00, image: 'https://alfatechperu.com/wp-content/uploads/2024/07/laptop-lenovo-thinkbook-15-g2-itl-intel-core-i5-1135g7-8gb-ram-256gb-ssd-15-6-fhd-ts-tactil-3.webp', description: 'Mouse óptico USB Dell de diseño ergonómico para uso diario.', featured: false, new: false, details: 'Conexión USB, alta precisión.' },
{ id: 'nys-len-tl15-i5-8-2', name: 'Laptop Lenovo ThinkLine 15 Intel Core i5 8GB RAM', category: 'COMPUTADORAS', price: 36800.00, image: 'https://rymportatiles.com.pe/cdn/shop/files/IDEAPADSLIM315IAH82_85316032-3e80-46dd-888b-39f40ccf2772.png?v=1702406521&width=1500', description: 'Laptop Lenovo con procesador Intel Core i5 y 8GB de RAM para productividad empresarial.', featured: true, new: true, details: 'SSD, Windows 11, teclado completo.' },
{ id: '9z7l4ua', name: 'Laptop HP 15-fd Intel Core i5', category: 'COMPUTADORAS', price: 34200.00, image: 'https://pcshop.ua/image/cache/webp/catalog/tovar/noutbuk-hp-victus-15-fb2063dx-9z7l4ua-mica-silver-1024x768.webp', description: 'Laptop HP con procesador Intel Core i5, diseño moderno y rendimiento confiable.', featured: true, new: false, details: 'Pantalla 15.6", SSD, Wi-Fi AC.' },
{ id: 'arg-ub-0182', name: 'Hub USB ArgomTech 4 Puertos ARG-UB-0182', category: 'ACCESORIOS', price: 780.00, image: 'https://www.corchacr.com/tienda/wp-content/uploads/2024/02/ARGOM-ADAPTADOR-MULTIPUERTO-USB-TIPO-C-4-EN-1-ONE-AXESS-ARG-UB-0182-31.jpg', description: 'Hub USB ArgomTech para expansión de puertos en laptops y PCs.', featured: false, new: false, details: 'Compacto, Plug & Play.' },
{ id: 'b9tp1la', name: 'Laptop HP 14 Intel Core i3', category: 'COMPUTADORAS', price: 28500.00, image: 'https://cdn.kemik.gt/2025/07/B9TP1LA-HP-1200x1200-01.-700x700.jpg', description: 'Laptop HP compacta con procesador Intel Core i3 para tareas cotidianas.', featured: false, new: true, details: 'Pantalla 14", SSD, diseño ligero.' },
{ id: '9s1r3ua', name: 'Laptop HP Pavilion Intel Core i7', category: 'COMPUTADORAS', price: 49800.00, image: 'https://static3.webx.pk/files/70503/Images/copy-7-czone.com.pk-1540-16261-200624115902-70503-0-031224034543771.jpg', description: 'Laptop HP Pavilion de alto rendimiento con procesador Intel Core i7.', featured: true, new: true, details: 'Gráficos integrados, SSD NVMe.' },
{ id: 'b95whua', name: 'Laptop HP 15 Intel Core i5', category: 'COMPUTADORAS', price: 33500.00, image: 'https://www.pcservice.com.uy/contentimg/93920/1/d/HPB95WHUA_01.jpg', description: 'Laptop HP de 15.6 pulgadas con procesador Intel Core i5 para uso profesional.', featured: false, new: false, details: 'SSD, teclado numérico.' },
{ id: 'c52squ8-aba', name: 'Desktop HP Pro SFF C52SQU8#ABA', category: 'COMPUTADORAS', price: 41200.00, image: 'https://www.ariwell.com/web/image/product.template/47666/image_1024?unique=e8184f2', description: 'Computadora de escritorio HP Pro formato SFF para oficina y empresa.', featured: true, new: false, details: 'Intel Core, expansión empresarial.' },
{ id: 'b42chut-aba', name: 'Desktop HP Pro Tower B42CHUT#ABA', category: 'COMPUTADORAS', price: 45900.00, image: 'https://www.bhphotovideo.com/images/fb/hp_b42chut_aba_14_elitebook_645_g11_1860140.jpg', description: 'Computadora de escritorio HP Pro Tower para alto rendimiento empresarial.', featured: true, new: true, details: 'Formato torre, fácil expansión.' },
{ id: '+8vy95av-cto-8-256', name: 'Laptop HP ProBook 8GB RAM 256GB SSD', category: 'COMPUTADORAS', price: 38900.00, image: 'https://img.cartimex.com/v2/upload/82TT009ULM%20gr.jpg', description: 'Laptop HP ProBook configurada con 8GB de RAM y SSD de 256GB.', featured: true, new: true, details: 'Uso profesional, construcción robusta.' },



 { id: 'msi-case-mag-forge-321r', name: 'NVR ACUSENSE DE 16 CANALES', category: 'REDES', price: 20780.84, image: 'https://sis.omega.com.do/ProductImages/6bb7526a-7fea-42f8-ad84-bddb08c036d8.png', description: 'NVR HIKVISION ACUSENSE, 16 CANALES, 4K, 1U, 8MP. Ideal para sistemas de vigilancia avanzados.', featured: true, new: true, details: 'Vidrio templado 4mm, diseño Airflow.' },

   
   

{ id: 'msi-psu-mag-a650bn', name: 'MSI MAG A650BN', category: 'COMPUTADORAS', price: 5422.63, image: 'https://sis.omega.com.do/ProductImages/aa3e919e-7c3b-49fb-a052-2c6db9f577fe.png', description: 'Fuente de poder MSI 650W.', featured: true, new: true, details: '80 Plus Bronze, formato ATX.' },

{ id: 'msi-coreliquid-a13-240', name: 'MSI CORELIQUID A13 240', category: 'COMPUTADORAS', price: 5124.00, image: 'https://sis.omega.com.do/ProductImages/2d2a2888-e5eb-4a29-a9aa-36dd0124ba37.png', description: 'Refrigeración líquida todo en uno.', featured: true, new: true, details: 'Radiador 240mm, alto rendimiento.' },

{ id: 'msi-coreliquid-a12-240', name: 'MSI CORELIQUID A12 240', category: 'COMPUTADORAS', price: 4905.73, image: 'https://tse4.mm.bing.net/th/id/OIP.4mD4fGSbx7AYwTKvmU0owwHaF7?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Sistema de enfriamiento líquido MSI.', featured: true, new: true, details: 'Radiador 240mm.' },

{ id: 'hp-victus-15-fa0033', name: 'HP Victus 15-fa0033', category: 'COMPUTADORAS', price: 62152.25, image: 'https://sis.omega.com.do/ProductImages/19322a84-412b-4fff-91ba-bf0448cb77d1.png', description: 'Laptop gaming HP Victus 15.6”.', featured: true, new: true, details: 'Intel i5, RTX 3050, pantalla 144Hz.' },

{ id: 'msi-psu-mag-a850gl', name: 'MSI MAG A850GL PCIE5', category: 'COMPUTADORAS', price: 10793.12, image: 'https://sis.omega.com.do/ProductImages/a0341330-64ee-4990-a02e-95211ba1b986.png', description: 'Fuente de poder MSI 850W.', featured: true, new: true, details: 'Compatible PCIe 5.0.' },

{ id: 'msi-monitor-mag-27c6x', name: 'MSI MAG 27C6X', category: 'COMPUTADORAS', price: 15044.95, image: 'https://sis.omega.com.do/ProductImages/20c922e1-7c74-400f-8cd7-70c6ca66a48d.png', description: 'Monitor gaming curvo MSI 27”.', featured: true, new: true, details: '280Hz OC, panel VA.' },

{ id: 'msi-mb-pro-h610m-g', name: 'MSI PRO H610M-G DDR4', category: 'COMPUTADORAS', price: 6759.33, image: 'https://sis.omega.com.do/ProductImages/e187cb7b-424c-44f9-aaae-7abf684f4e52.png', description: 'Tarjeta madre MSI H610.', featured: true, new: true, details: 'LGA 1700, Micro-ATX.' },

{ id: 'msi-mb-pro-b760m-p', name: 'MSI PRO B760M-P', category: 'COMPUTADORAS', price: 7631.50, image: 'https://sis.omega.com.do/ProductImages/884be861-3fa8-47d9-8a3b-f97f4af5cf0b.png', description: 'Motherboard MSI B760.', featured: true, new: true, details: 'Soporte Intel 13ª Gen.' },

{ id: 'agiler-mouse-optico', name: 'Agiler Mouse Óptico', category: 'COMPUTADORAS', price: 161.64, image: 'https://sis.omega.com.do/ProductImages/902ffd4f-a7b5-4bec-8e5f-0cc5f0e955b9.png', description: 'Mouse óptico alámbrico.', featured: true, new: true, details: 'Conexión USB.' },

{ id: 'kingston-ssd-kc3000-512gb', name: 'Kingston SSD KC3000 512GB', category: 'COMPUTADORAS', price: 7622.02, image: 'https://sis.omega.com.do/ProductImages/0352a231-2d90-4f1b-b6c6-f34270de5487.png', description: 'Disco sólido NVMe Kingston.', featured: true, new: true, details: 'M.2 2280, alta velocidad.' },

{ id: 'primus-silla-throno', name: 'Primus Throno', category: 'COMPUTADORAS', price: 11089.12, image: 'https://sis.omega.com.do/ProductImages/db7d7f19-4087-4938-a7be-7e65bba7a7ca.png', description: 'Silla gamer Primus.', featured: true, new: true, details: 'Espaldar alto, brazos ajustables.' },

{ id: 'antec-case-c8-argb', name: 'Antec C8 ARGB White', category: 'COMPUTADORAS', price: 10085.70, image: 'https://sis.omega.com.do/ProductImages/a357413a-3aee-4230-951b-5123722597a3.png', description: 'Gabinete gaming Antec.', featured: true, new: true, details: 'Diseño doble cámara, ARGB.' },

{ id: 'panduit-keystone-cat6a', name: 'Panduit Keystone CAT6A', category: 'REDES', price: 1149.43, image: 'https://sis.omega.com.do/ProductImages/168b7b2a-ac44-4b0e-9702-2873635bb958.png', description: 'Jack Keystone Panduit.', featured: true, new: true, details: 'Categoría 6A.' },

{ id: 'agiler-cable-utp-cat6', name: 'Agiler Cable UTP CAT6', category: 'REDES', price: 3645.86, image: 'https://sis.omega.com.do/ProductImages/013b955c-0069-4dc3-be32-77bf94525880.png', description: 'Rollo de cable UTP.', featured: true, new: true, details: '1000 pies, 23 AWG.' },

{ id: 'panduit-keystone-cat5e-rojo', name: 'Panduit Keystone CAT5E Rojo', category: 'CONECTORES', price: 152.17, image: 'https://sis.omega.com.do/ProductImages/72514.png', description: 'Jack Keystone Panduit CAT5E.', featured: true, new: true, details: 'Color rojo.' },

{ id: 'agiler-cable-utp-cat5e-1000', name: 'Agiler Cable UTP CAT5E 1000 pies', category: 'CABLE', price: 2334.26, image: 'https://sis.omega.com.do/ProductImages/c82b5ef6-4ef4-4959-bfb7-078f4b6f31dd.png', description: 'Rollo de cable UTP CAT5E.', featured: true, new: true, details: '1000 pies.' },

{ id: 'clickcam-cable-utp-cat6', name: 'Click Cam Cable UTP CAT6', category: 'CABLE', price: 2783.44, image: 'https://sis.omega.com.do/ProductImages/53c921a7-8a40-49e0-897b-09b8c0159a26.png', description: 'Cable UTP CAT6 Click Cam.', featured: true, new: true, details: '30% cobre, 0.5mm.' },

{ id: 'nexxt-keystone-cat6e-gris', name: 'Nexxt Keystone CAT6E Gris', category: 'REDES', price: 155.73, image: 'https://sis.omega.com.do/ProductImages/a43d6f68-cd51-4749-9610-3796337971b4.png', description: 'Jack Keystone Nexxt.', featured: true, new: true, details: 'Categoría 6E.' },

{ id: 'agiler-keystone-cat5e-azul', name: 'Agiler Keystone CAT5E Azul', category: 'REDES', price: 155.73, image: 'https://sis.omega.com.do/ProductImages/36d323c5-2611-4ea3-890b-45d1f22769ec.png', description: 'Jack Keystone Agiler.', featured: false, new: true, details: 'Conector tipo 110.' },

{ id: 'nexxt-patch-cable-cat6-3ft', name: 'Nexxt Patch Cable CAT6 3ft', category: 'REDES', price: 141.47, image: 'https://sis.omega.com.do/ProductImages/66724.png', description: 'Patch cord Nexxt CAT6.', featured: true, new: true, details: 'Longitud 3 pies.' },

{ id: 'cooler-master-td500', name: 'Cooler Master TD500', category: 'COMPUTADORAS', price: 2783.44, image: 'https://sis.omega.com.do/ProductImages/53c921a7-8a40-49e0-897b-09b8c0159a26.png', description: 'Gabinete ATX Cooler Master.', featured: false, new: true, details: 'Diseño airflow.' },

{ id: 'aoc-monitor-24-180hz', name: 'AOC Monitor 24 180Hz', category: 'COMPUTADORAS', price: 14740.97, image: 'https://sis.omega.com.do/ProductImages/13f0ed2e-4806-4edb-b172-95b3236caa42.png', description: 'Monitor AOC gaming 24”.', featured: true, new: true, details: 'Fast IPS, 180Hz.' },

{ id: 'logitech-mouse-m170-blue', name: 'Logitech M170 Azul', category: 'COMPUTADORAS', price: 782.11, image: 'https://sis.omega.com.do/ProductImages/3f6a64c6-fecd-42db-8203-5c7bea0b3147.png', description: 'Mouse inalámbrico Logitech.', featured: true, new: true, details: 'Receptor USB.' },

{ id: 'hp-prodesk-400-g9', name: 'HP ProDesk 400 G9 SFF', category: 'COMPUTADORAS', price: 81783.35, image: 'https://sis.omega.com.do/ProductImages/fe2b00a6-03b5-41fe-8ae8-33eb0e417dc4.png', description: 'Desktop empresarial HP.', featured: true, new: true, details: 'Formato Small Form Factor.' },

{ id: 'aoc-monitor-27-180hz', name: 'AOC Monitor 27 180Hz', category: 'COMPUTADORAS', price: 14060.62, image: 'https://tse1.mm.bing.net/th/id/OIP.RGQod8tx2Hsi0D4ExAk-kgHaGU?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3', description: 'Monitor gaming AOC 27”.', featured: true, new: true, details: 'Alta tasa de refresco.' },

{ id: 'samsung-monitor-g30a-24', name: 'Samsung Odyssey G30A 24', category: 'COMPUTADORAS', price: 10941.81, image: 'https://sis.omega.com.do/ProductImages/66e1cc21-ba7c-4ea7-bae2-4c9070f8ae53.png', description: 'Monitor gaming Samsung.', featured: true, new: true, details: 'Full HD.' },

{ id: 'lenovo-ideapad-1-i5', name: 'Lenovo IdeaPad 1 I5', category: 'COMPUTADORAS', price: 32236.49, image: 'https://sis.omega.com.do/ProductImages/069e2e10-fc36-4d9d-80ff-74accabff55e.png', description: 'Laptop Lenovo IdeaPad.', featured: true, new: true, details: 'Intel i5, 15.6”.' },

{ id: 'dell-optiplex-7020', name: 'Dell Optiplex 7020 SFF', category: 'COMPUTADORAS', price: 71400.50, image: 'https://sis.omega.com.do/ProductImages/8c0f80c7-6b7a-4183-adae-7fe4eb0205d0.png', description: 'Desktop Dell Optiplex.', featured: true, new: true, details: 'Formato compacto.' },

{ id: 'hp-pavilion-15-i3', name: 'HP Pavilion 15 I3', category: 'COMPUTADORAS', price: 26530.01, image: 'https://sis.omega.com.do/ProductImages/4ed712da-6bbc-41d9-bb19-16385b067db8.png', description: 'Laptop HP Pavilion.', featured: true, new: true, details: 'Pantalla IPS 15.6”.' },

{ id: 'lenovo-ideapad-3-i7', name: 'Lenovo IdeaPad 3 I7', category: 'COMPUTADORAS', price: 48771.13, image: 'https://sis.omega.com.do/ProductImages/f484c3c8-123b-482e-a24d-cbd78358022d.png', description: 'Laptop Lenovo IdeaPad 3.', featured: true, new: true, details: 'Intel i7.' },

{ id: 'dynabook-portege-x30w', name: 'Dynabook Portege X30W', category: 'COMPUTADORAS', price: 54759.53, image: 'https://sis.omega.com.do/ProductImages/41358ffe-8a89-4b43-aabc-12a8a6ae5cf7.png', description: 'Laptop 2 en 1 Dynabook.', featured: true, new: true, details: 'Pantalla táctil 13.3”.' },


 
];


// ===============================================
// 1. FUNCIONES DE RENDERIZADO Y FILTRO (MODIFICADO)
// ===============================================

function renderProductCard(producto) {
    const newBadge = producto.new ? `<span class="absolute top-2 right-2 bg-primary text-bg-dark text-xs font-bold px-2 py-1 rounded-full z-10">NUEVO</span>` : '';
    
    return `
        <div class="product-card bg-secondary rounded-xl shadow-lg border border-slate-800 hover:border-primary transition duration-300 relative overflow-hidden flex flex-col">
            ${newBadge}
            <a href="detalle-producto.html?id=${producto.id}" class="block overflow-hidden">
                <img src="${producto.image}" alt="${producto.name}" class="w-full h-48 object-cover transition duration-500 hover:scale-105">
            </a>
            <div class="p-5 flex flex-col flex-grow">
                <span class="text-xs font-semibold text-primary mb-1">${producto.category}</span>
                <h3 class="text-lg font-bold text-white mb-2 flex-grow">${producto.name}</h3>
                <p class="text-sm text-slate-400 line-clamp-2 mb-3">${producto.description}</p>
                
                <div class="flex justify-between items-center mt-auto">
                    

<span class="text-sm text-slate-400 italic">
    Ver detalles
</span>



                
                    <button 
                        class="add-to-cart-btn bg-primary text-bg-dark px-4 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-80 transition"
                        data-product-id="${producto.id}"
                    >
                        <i data-lucide="shopping-cart" class="inline w-4 h-4 mr-1"></i> Añadir
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderProducts(productos, container) {
    if (productos.length === 0) {
        container.innerHTML = `<p class="col-span-4 text-center py-10 text-slate-400">No hay productos disponibles.</p>`;
        return;
    }
    
    container.innerHTML = productos.map(renderProductCard).join('');
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Muestra productos de una categoría específica con límite inicial. (MODIFICADO)
 * @param {string} categoria 
 * @param {number} limit - 0 o un valor negativo para mostrar todos.
 */
function mostrarCategoria(categoria, limit = INITIAL_PRODUCT_LIMIT) {
    const cont = document.getElementById("product-list");
    const verMasBtn = document.getElementById('ver-mas-btn');
    const categoryBtns = document.querySelectorAll('.category-btn');

    if (!cont || !verMasBtn) return;

    // Actualizar estado del botón activo
    categoryBtns.forEach(btn => {
        btn.classList.remove('bg-primary', 'text-bg-dark');
        btn.classList.add('bg-secondary', 'text-text-light');
        if (btn.dataset.category.toUpperCase() === categoria.toUpperCase()) {
            btn.classList.remove('bg-secondary', 'text-text-light');
            btn.classList.add('bg-primary', 'text-bg-dark');
        }
    });

    // Limpiar
    cont.innerHTML = `<p class="col-span-4 text-center py-10 text-slate-400">Cargando productos...</p>`;

    // FILTRAR todos los productos de la categoría
    const filtrados = categoria.toUpperCase() === 'ALL'
        ? ALL_PRODUCTS_DATA
        : ALL_PRODUCTS_DATA.filter(p => p.category && p.category.toUpperCase() === categoria.toUpperCase());
    
    // Aplicar límite si es positivo y si hay más productos que el límite
    const productosAMostrar = limit > 0 && filtrados.length > limit ? filtrados.slice(0, limit) : filtrados;

    // Renderiza
    setTimeout(() => { // Simular tiempo de carga
        cont.className = "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8"; // Asegurar el grid
        renderProducts(productosAMostrar, cont);
        
        // Gestionar el botón "Ver más productos" (NUEVO)
        if (filtrados.length > INITIAL_PRODUCT_LIMIT && limit > 0) {
            verMasBtn.classList.remove('hidden');
            verMasBtn.dataset.category = categoria; // Guarda la categoría actual para el clic
        } else {
            verMasBtn.classList.add('hidden');
        }

    }, 300);
}


// ===============================================
// 2. LÓGICA DEL CARRITO
// ===============================================

function getCartItems() {
    const cart = localStorage.getItem('cartItems');
    return cart ? JSON.parse(cart) : [];
}

function saveCartItems(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
}

function updateCartQuantity(productId, change) {
    let cartItems = getCartItems();
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += change;
        if (existingItem.quantity <= 0) {
            cartItems = cartItems.filter(item => item.id !== productId);
        }
    }
    
    saveCartItems(cartItems);
    updateCartDisplay();
}

function addToCart(productId) {
    const product = ALL_PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    let cartItems = getCartItems();
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            image: product.image,
            quantity: 1 
        });
    }

    saveCartItems(cartItems);
    updateCartDisplay();
    
    Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: `${product.name} añadido al carrito`,
        showConfirmButton: false,
        timer: 3000,
        background: '#1e203bff',
        color: '#e2e8f0'
    });
}

function renderCartItems(cartItems) {
    const container = document.getElementById('cart-items-container');
    const totalSpan = document.getElementById('cart-total');
    let total = 0;

    if (!container || !totalSpan) return;

    if (cartItems.length === 0) {
        container.innerHTML = `<div class="py-10"><p class="text-center text-slate-500">El carrito está vacío.</p></div>`;
        totalSpan.textContent = '$0.00';
        return;
    }

    const cartHtml = cartItems.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center space-x-3 text-left">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                    <div>
                        <p class="text-sm font-semibold text-white truncate w-24">${item.name}</p>
                        <p class="text-xs text-slate-400">$${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
                
                <div class="flex items-center space-x-2 text-text-light">
                    <button class="update-quantity-btn bg-slate-700 w-6 h-6 rounded-full hover:bg-slate-600 transition text-lg leading-none" data-product-id="${item.id}" data-change="-1">
                        &minus;
                    </button>
                    <span class="font-bold w-4 text-center">${item.quantity}</span>
                    <button class="update-quantity-btn bg-slate-700 w-6 h-6 rounded-full hover:bg-slate-600 transition text-lg leading-none" data-product-id="${item.id}" data-change="1">
                        +
                    </button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = cartHtml;
    totalSpan.textContent = `$${total.toFixed(2)}`;
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function updateCartDisplay() {
    const cartItems = getCartItems();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = totalItems;
    }

    renderCartItems(cartItems);
}

async function sendOrderToFirebase() {
    const cartItems = getCartItems();
    const user = auth?.currentUser; // Usar optional chaining para seguridad

    if (cartItems.length === 0) {
        Swal.fire('Carrito Vacío', 'Por favor, añade productos al carrito antes de pagar.', 'warning');
        return;
    }
    
    if (!user) {
        Swal.fire('Iniciar Sesión Requerido', 'Debes iniciar sesión para completar tu pedido.', 'error');
        return;
    }

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    try {
        await db.collection("orders").add({
            userId: user.uid,
            userEmail: user.email,
            nickname: localStorage.getItem('userNickname') || 'N/A',
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: total.toFixed(2),
            date: firebase.firestore.FieldValue.serverTimestamp()
        });

        saveCartItems([]);
        updateCartDisplay();
        
        Swal.fire({
            title: '¡Pedido Exitoso!',
            text: `Tu pedido por un total de $${total.toFixed(2)} ha sido enviado y registrado.`,
            icon: 'success',
            background: '#1e293b',
            color: '#e2e8f0'
        });

    } catch (error) {
        console.error("Error al registrar el pedido:", error);
        Swal.fire('Error', 'Hubo un problema al procesar tu pedido. Intenta más tarde.', 'error');
    }
}


// ===============================================
// 3. LÓGICA DE AUTENTICACIÓN
// ===============================================

async function handleRegistration(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const nickname = document.getElementById('reg-nickname').value || email.split('@')[0];
    
    if (firebaseConfig.projectId === "tu-project-id" || !auth) {
         Swal.fire('Error de Configuración', 'Debes configurar tus credenciales de Firebase en app.js para usar el registro.', 'error');
         return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await db.collection("users").doc(user.uid).set({
            email: email,
            nickname: nickname,
            created: firebase.firestore.FieldValue.serverTimestamp()
        });

        localStorage.setItem('userNickname', nickname);
        
        // Mostrar mensaje de éxito y desaparecer el formulario
        document.getElementById('auth-content').classList.remove('bg-secondary', 'p-8', 'shadow-2xl', 'border', 'border-slate-700');
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('auth-title').textContent = '¡Gracias por unirte a SHIM Tech!';
        document.getElementById('registration-success').classList.remove('hidden');

        updateAuthUI(user);

    } catch (error) {
        console.error("Error de registro:", error);
        Swal.fire('Error de Registro', error.message, 'error');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('log-email').value;
    const password = document.getElementById('log-password').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        const userDoc = await db.collection("users").doc(user.uid).get();
        const nickname = userDoc.exists ? userDoc.data().nickname : user.email.split('@')[0];
        
        localStorage.setItem('userNickname', nickname);
        
        // Mostrar mensaje de logueado
        document.getElementById('auth-content').classList.remove('bg-secondary', 'p-8', 'shadow-2xl', 'border', 'border-slate-700');
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('auth-title').textContent = '¡Bienvenido de vuelta!';
        document.getElementById('logged-in-message').classList.remove('hidden');
        document.getElementById('welcome-user-nickname').textContent = nickname;

        updateAuthUI(user);
        
    } catch (error) {
        console.error("Error de inicio de sesión:", error);
        Swal.fire('Error de Login', error.message, 'error');
    }
}

function handleLogout() {
    auth?.signOut().then(() => {
        localStorage.removeItem('userNickname');
        updateAuthUI(null);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'Sesión Cerrada',
            showConfirmButton: false,
            timer: 2000,
            background: '#1e293b',
            color: '#e2e8f0'
        });
        
        if (document.body.id === 'home-page') {
            document.getElementById('auth-section')?.classList.remove('hidden'); // Asegurar que se muestre
            document.getElementById('auth-content').classList.add('bg-secondary', 'p-8', 'shadow-2xl', 'border', 'border-slate-700');
            document.getElementById('auth-title').textContent = 'Regístrate para continuar';
            document.getElementById('register-form').classList.remove('hidden');
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('registration-success').classList.add('hidden');
            document.getElementById('logged-in-message').classList.add('hidden');
        }

    }).catch((error) => {
        console.error("Error al cerrar sesión:", error);
    });
}

function updateAuthUI(user) {
    const profileContainer = document.getElementById('user-profile-container');
    const nicknameElement = document.getElementById('user-nickname');
    const authBtnDesktop = document.getElementById('show-auth-btn-desktop');
    const authBtnMobile = document.getElementById('show-auth-btn-mobile');

    if (!profileContainer || !nicknameElement || !authBtnDesktop || !authBtnMobile) return;

    if (user) {
        const nickname = localStorage.getItem('userNickname') || user.email?.split('@')[0] || 'Usuario';
        nicknameElement.textContent = nickname;
        profileContainer.classList.remove('hidden');
        authBtnDesktop.classList.add('hidden');
        authBtnMobile.classList.add('hidden');
        
        if (document.body.id === 'home-page') {
             document.getElementById('auth-section')?.classList.add('hidden');
        }

    } else {
        nicknameElement.textContent = 'Invitado';
        profileContainer.classList.add('hidden');
        authBtnDesktop.classList.remove('hidden');
        authBtnMobile.classList.remove('hidden');

         if (document.body.id === 'home-page') {
             document.getElementById('auth-section')?.classList.remove('hidden');
        }
    }
}


// ===============================================
// 4. INICIALIZACIÓN Y EVENTOS
// ===============================================

function loadHomePage() {
    // 1. Asignar eventos de filtro de categoría
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            // Al cambiar de categoría, siempre empieza con el límite
            mostrarCategoria(category, INITIAL_PRODUCT_LIMIT); 
            // Limpiar barra de búsqueda
            document.getElementById('product-search').value = ''; 
             document.getElementById('product-search-mobile').value = '';
            document.getElementById("productos-destacados-title").textContent = "Nuestros Productos";
            
             // Asegurar que el contenedor de búsqueda esté oculto
            document.getElementById("search-results-container")?.classList.add('hidden');
            document.getElementById("productos-destacados")?.classList.remove('hidden');
        });
    });

    // 2. Evento para el botón "Ver más productos" (NUEVO)
    document.getElementById('ver-mas-btn')?.addEventListener('click', (e) => {
        const category = e.target.dataset.category || 'ALL';
        // Mostrar todos los productos (límite 0)
        mostrarCategoria(category, 0); 
        e.target.classList.add('hidden'); // Ocultar el botón después de mostrar todos
    });
    
    // Cargar la categoría 'ALL' por defecto con límite inicial
    mostrarCategoria('ALL', INITIAL_PRODUCT_LIMIT);
}

function loadProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = ALL_PRODUCTS_DATA.find(p => p.id === productId);
    const container = document.getElementById('product-detail-container');
    const titleElement = document.getElementById('page-title');

    // ... (El resto de la lógica de carga de detalle, igual que antes)
    if (!product || !container) {
        container.innerHTML = `<p class="text-center py-20 text-red-400">Error: Producto no encontrado.</p>`;
        if(titleElement) titleElement.textContent = "Producto No Encontrado | SHIM Tech";
        return;
    }

    if(titleElement) titleElement.textContent = `${product.name} | SHIM Tech`;

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div class="rounded-lg overflow-hidden bg-bg-dark p-4 border border-slate-700">
                <img src="${product.image}" alt="${product.name}" class="w-full object-cover rounded-md shadow-xl">
            </div>
            
            <div class="flex flex-col">
                <span class="text-sm font-semibold text-primary mb-2">${product.category}</span>
                <h1 class="text-4xl font-extrabold text-white mb-4">${product.name}</h1>
                
                <div class="flex items-center mb-6">
                   

<span class="text-3xl font-extrabold text-primary">
    ${product.price.toLocaleString('es-DO', {
        style: 'currency',
        currency: 'DOP'
    })}
</span>


                
                </div>

                <p class="text-slate-300 mb-8">${product.description}</p>
                
                <h3 class="text-xl font-bold text-white mb-3 border-b border-slate-700 pb-2">Especificaciones Clave</h3>
                <ul class="text-slate-400 space-y-2 mb-8">
                    ${product.details.split(',').map(d => `<li class="flex items-center"><i data-lucide="check-circle" class="w-4 h-4 mr-2 text-primary"></i>${d.trim()}</li>`).join('')}
                </ul>

                <button 
                    class="add-to-cart-btn w-full lg:w-3/4 bg-primary text-bg-dark py-3 rounded-lg font-bold text-lg hover:bg-opacity-80 transition duration-300"
                    data-product-id="${product.id}"
                >
                    <i data-lucide="shopping-cart" class="inline w-5 h-5 mr-2"></i> Añadir al Carrito
                </button>
            </div>
        </div>
    `;
    
    // Renderizar productos relacionados/destacados
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
        const related = ALL_PRODUCTS_DATA.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
        renderProducts(related.length > 0 ? related : ALL_PRODUCTS_DATA.filter(p => p.featured).slice(0, 4), featuredContainer);
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function setupAuthFormListeners() {
    const showLoginBtn = document.getElementById('show-login-btn');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const authTitle = document.getElementById('auth-title');

    if (showLoginBtn) showLoginBtn.addEventListener('click', () => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        authTitle.textContent = 'Iniciar Sesión';
    });
    
    if (showRegisterBtn) showRegisterBtn.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        authTitle.textContent = 'Regístrate para continuar';
    });

    if (registerForm) registerForm.addEventListener('submit', handleRegistration);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    document.querySelectorAll('#show-auth-btn-desktop, #show-auth-btn-mobile').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const authSection = document.getElementById('auth-section');
            if (authSection) {
                 authSection.scrollIntoView({ behavior: 'smooth' });
                 registerForm.classList.remove('hidden');
                 loginForm.classList.add('hidden');
                 document.getElementById('auth-title').textContent = 'Regístrate para continuar';
            }
        });
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
}


function initEventListeners() {
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });

    const cartBtn = document.getElementById('cart-button');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    const toggleCart = () => {
        cartSidebar.classList.toggle('translate-x-full');
        cartOverlay.classList.toggle('hidden');
    };

    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    document.getElementById('checkout-btn')?.addEventListener('click', sendOrderToFirebase);

    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const productId = e.target.closest('.add-to-cart-btn').dataset.productId;
            addToCart(productId);
        }
        
        if (e.target.closest('.update-quantity-btn')) {
            const btn = e.target.closest('.update-quantity-btn');
            const productId = btn.dataset.productId;
            const change = parseInt(btn.dataset.change);
            updateCartQuantity(productId, change);
        }
    });
    
    // ** Event listener para la barra de búsqueda en el encabezado **
    const searchInputs = document.querySelectorAll('#product-search, #product-search-mobile');
    if (searchInputs) {
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => { 
                if (document.body.id === 'home-page') { 
                    handleSearch(e.target.value);
                }
            });
        });
    }


    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (header && document.body.id === 'home-page') { 
            if (window.scrollY > 50) {
                header.classList.add('shadow-xl');
                header.style.background = 'rgba(90, 0, 0, 0)'; 
            } else {
                header.classList.remove('shadow-xl');
                header.style.background = 'rgba(0, 35, 122, 0)'; 
            }
        }
    });
}

// Manejador especializado para clics en submenús
document.addEventListener('click', (e) => {
    const subBtn = e.target.closest('.submenu-item');
    if (!subBtn) return;

    e.preventDefault();
    const mainCat = subBtn.dataset.main;
    const subTerm = subBtn.dataset.sub.toLowerCase();

    // Filtramos los productos que:
    // 1. Coincidan con la categoría principal (ej: COMPUTADORAS)
    // 2. Tengan el término (ej: Laptop) en su nombre o descripción
    const filtered = ALL_PRODUCTS_DATA.filter(p => {
        const matchesMain = p.category === mainCat;
        const matchesSub = p.name.toLowerCase().includes(subTerm) || 
                           p.description.toLowerCase().includes(subTerm);
        return matchesMain && matchesSub;
    });

    // Renderizamos los productos en el contenedor
    const container = document.getElementById("product-list");
    if (container) {
        container.innerHTML = filtered.map(renderProductCard).join('');
        
        // Reiniciamos los iconos de Lucide para que se vean en las nuevas tarjetas
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        // Scroll suave hacia los productos para mejor experiencia
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
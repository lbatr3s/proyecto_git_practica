
/**
 * main.js - Script principal para cargar y mostrar perfiles
 * 
 * Este archivo carga dinámicamente todos los perfiles JSON de la carpeta profiles/
 * y los muestra en la página principal como tarjetas de perfil.
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando carga de perfiles...');
    cargarPerfiles();
});

/**
 * Función principal para cargar todos los perfiles
 * 
 * Esta función intenta cargar los archivos de perfil desde la carpeta profiles/
 */
async function cargarPerfiles() {
    // Lista de archivos de perfil a cargar
    const archivosPerfiles = [
        'ejemplo.json',
        'sofia-sandoval.json'  // ← Agrega esta línea
    ];

    const contenedor = document.getElementById('profiles-container');
    const mensajeVacio = document.getElementById('empty-message');
    let perfilesCargados = 0;

    // Intentar cargar cada archivo de perfil
    for (const archivo of archivosPerfiles) {
        try {
            const respuesta = await fetch(`profiles/${archivo}`);
            
            if (respuesta.ok) {
                const perfil = await respuesta.json();
                
                // Validar que el perfil tenga los campos necesarios
                if (validarPerfil(perfil)) {
                    crearTarjetaPerfil(perfil, contenedor);
                    perfilesCargados++;
                } else {
                    console.warn(`⚠️ Perfil inválido en ${archivo}`);
                }
            } else {
                console.warn(`⚠️ No se pudo cargar ${archivo}`);
            }
        } catch (error) {
            console.error(`❌ Error al cargar ${archivo}:`, error);
        }
    }

    // Actualizar contador de miembros del equipo
    document.getElementById('team-count').textContent = perfilesCargados;

    // Mostrar mensaje si no hay perfiles
    if (perfilesCargados === 0) {
        mensajeVacio.style.display = 'block';
    } else {
        mensajeVacio.style.display = 'none';
    }

    console.log(`✅ Se cargaron ${perfilesCargados} perfiles correctamente`);
}

/**
 * Validar que un perfil tenga todos los campos requeridos
 * @param {Object} perfil - Objeto con los datos del perfil
 * @returns {boolean} - true si el perfil es válido
 */
function validarPerfil(perfil) {
    return perfil.nombre && 
           perfil.rol && 
           perfil.descripcion;
}

/**
 * Crear una tarjeta de perfil en el DOMa
 * @param {Object} perfil - Datos del perfil
 * @param {HTMLElement} contenedor - Elemento donde se agregará la tarjeta
 */
function crearTarjetaPerfil(perfil, contenedor) {
    // Crear elemento de tarjeta
    const tarjeta = document.createElement('div');
    tarjeta.className = 'profile-card';
    tarjeta.style.animationDelay = `${contenedor.children.length * 0.1}s`;

    // Obtener iniciales para el avatar
    const iniciales = obtenerIniciales(perfil.nombre);

    // Crear estructura HTML de la tarjeta
    tarjeta.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">${iniciales}</div>
            <div class="profile-info">
                <h3>${escapeHtml(perfil.nombre)}</h3>
                <p class="profile-role">${escapeHtml(perfil.rol)}</p>
            </div>
        </div>
        <p class="profile-description">${escapeHtml(perfil.descripcion)}</p>
        ${crearEnlacesSociales(perfil.social)}
    `;

    // Agregar tarjeta al contenedor
    contenedor.appendChild(tarjeta);
}

/**
 * Obtener las iniciales de un nombre
 * @param {string} nombre - Nombre completo
 * @returns {string} - Iniciales (máximo 2 letras)
 */
function obtenerIniciales(nombre) {
    const palabras = nombre.trim().split(' ');
    if (palabras.length >= 2) {
        return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
}

/**
 * Crear los enlaces de redes sociales
 * @param {Object} social - Objeto con los enlaces sociales
 * @returns {string} - HTML de los enlaces sociales
 */
function crearEnlacesSociales(social) {
    if (!social) return '';

    const redesSociales = [];

    // Mapeo de redes sociales a iconos de Font Awesome
    const iconos = {
        github: 'fa-github',
        linkedin: 'fa-linkedin',
        twitter: 'fa-twitter',
        email: 'fa-envelope',
        website: 'fa-globe'
    };

    for (const [red, url] of Object.entries(social)) {
        if (url) {
            const icono = iconos[red] || 'fa-link';
            const enlace = red === 'email' ? `mailto:${url}` : url;
            redesSociales.push(`
                <a href="${escapeHtml(enlace)}" 
                   class="social-link" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   title="${red}">
                    <i class="fab ${icono}"></i>
                </a>
            `);
        }
    }

    if (redesSociales.length > 0) {
        return `<div class="profile-social">${redesSociales.join('')}</div>`;
    }

    return '';
}

/**
 * Escapar HTML para prevenir XSS
 * @param {string} texto - Texto a escapar
 * @returns {string} - Texto escapado
 */
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * FUNCIÓN ALTERNATIVA: Cargar perfiles desde un archivo index
 * 
 * Si prefieres no modificar main.js cada vez que se agrega un perfil,
 * puedes crear un archivo profiles/index.json con la lista de archivos
 * y usar esta función en lugar de cargarPerfiles()
 */
async function cargarPerfilesDesdeIndex() {
    try {
        const respuesta = await fetch('profiles/index.json');
        const data = await respuesta.json();
        
        const contenedor = document.getElementById('profiles-container');
        const mensajeVacio = document.getElementById('empty-message');
        let perfilesCargados = 0;

        for (const perfil of data.perfiles) {
            if (validarPerfil(perfil)) {
                crearTarjetaPerfil(perfil, contenedor);
                perfilesCargados++;
            }
        }

        document.getElementById('team-count').textContent = perfilesCargados;
        mensajeVacio.style.display = perfilesCargados === 0 ? 'block' : 'none';

    } catch (error) {
        console.error('❌ Error al cargar perfiles:', error);
        document.getElementById('empty-message').style.display = 'block';
    }
}

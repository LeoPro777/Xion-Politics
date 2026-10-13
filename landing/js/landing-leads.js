/**
 * SIGO-PJ Zulia - Landing Page Leads Ingestion Script
 * Manejo resiliente de registros con sincronización offline y normalización de datos.
 */

const API_BASE_URL = window.SIGO_API_URL || 'http://localhost:8000/api/v1';
const STORAGE_KEY_PENDING_LEADS = 'sigo_pj_pending_leads';

/**
 * Normaliza números de teléfono al formato internacional +58...
 */
function normalizePhoneNumber(rawPhone) {
    if (!rawPhone) return '';
    let cleaned = rawPhone.replace(/\D/g, '');
    
    // Si inicia con 0 (ej: 04141234567 -> 584141234567)
    if (cleaned.startsWith('0')) {
        cleaned = '58' + cleaned.substring(1);
    }
    // Si no incluye el código de país pero empieza con 4 (ej: 4141234567 -> 584141234567)
    else if (cleaned.startsWith('4') && cleaned.length === 10) {
        cleaned = '58' + cleaned;
    }
    
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

/**
 * Guarda un lead en almacenamiento local en caso de falla de red
 */
function saveLeadOffline(leadData) {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING_LEADS) || '[]');
        stored.push({
            data: leadData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEY_PENDING_LEADS, JSON.stringify(stored));
        console.info('[SIGO Offline] Lead guardado localmente para reintento automático.');
    } catch (e) {
        console.error('[SIGO Offline] Error al almacenar en localStorage:', e);
    }
}

/**
 * Sincroniza leads almacenados localmente cuando se restablece la red
 */
async function syncOfflineLeads() {
    if (!navigator.onLine) return;
    
    let stored = [];
    try {
        stored = JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING_LEADS) || '[]');
    } catch (e) {
        return;
    }
    
    if (stored.length === 0) return;
    
    console.info(`[SIGO Sync] Intentando sincronizar ${stored.length} leads pendientes...`);
    const remaining = [];
    
    for (const item of stored) {
        try {
            const response = await fetch(`${API_BASE_URL}/leads/public`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(item.data)
            });
            
            if (!response.ok) {
                // Si es un error del cliente (422), descartar o no reintentar indefinidamente
                if (response.status >= 400 && response.status < 500) {
                    console.warn('[SIGO Sync] Descartado lead con error de validación:', item.data);
                } else {
                    remaining.push(item);
                }
            } else {
                console.info('[SIGO Sync] Lead sincronizado con éxito');
            }
        } catch (err) {
            remaining.push(item);
        }
    }
    
    localStorage.setItem(STORAGE_KEY_PENDING_LEADS, JSON.stringify(remaining));
}

/**
 * Envía un lead a la API REST con fallback offline
 */
async function submitLead(payload) {
    // Normalizar teléfono
    payload.telefono = normalizePhoneNumber(payload.telefono);

    if (!navigator.onLine) {
        saveLeadOffline(payload);
        return {
            status: 'queued',
            message: 'Sin conexión a internet. Tu registro se enviará automáticamente al reconectarse.'
        };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/leads/public`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Error de servidor' }));
            throw new Error(errorData.detail || `Error HTTP ${response.status}`);
        }

        const data = await response.json();
        return {
            status: 'success',
            data
        };
    } catch (error) {
        console.warn('[SIGO] Falló la petición a la API, activando fallback offline:', error.message);
        saveLeadOffline(payload);
        return {
            status: 'queued',
            message: 'No pudimos conectar con el servidor central. Tu registro se guardó de forma segura y se enviará automáticamente.'
        };
    }
}

// Escuchar evento online para sincronización inmediata
window.addEventListener('online', () => {
    console.info('[SIGO] Conexión a internet reanudada. Sincronizando leads...');
    syncOfflineLeads();
});

// Sincronizar en carga inicial
document.addEventListener('DOMContentLoaded', () => {
    syncOfflineLeads();
});

// Exportar globalmente
window.SigoLeads = {
    submitLead,
    syncOfflineLeads,
    normalizePhoneNumber
};

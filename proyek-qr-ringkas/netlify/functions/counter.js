/*
 * ========================================
 * KODE BACKEND BARU (Netlify Function)
 * ========================================
 */

// 'fetch' sudah tersedia di Netlify Functions
exports.handler = async function(event, context) {
    
    // 1. Ambil URL rahasia dari variabel di Netlify
    const FIREBASE_URL = process.env.FIREBASE_DB_URL;
    if (!FIREBASE_URL) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Database URL not configured' }) };
    }

    // Kita akan simpan angkanya di node 'visitorCount'.
    // .json di akhir adalah trik API REST Firebase
    const DB_PATH = `${FIREBASE_URL}/visitorCount.json`; 

    try {
        // 2. Ambil nilai saat ini (GET)
        let count = 0;
        const getResponse = await fetch(DB_PATH);
        
        // Cek jika getResponse tidak null sebelum .json()
        if (getResponse.ok) {
            const currentData = await getResponse.json();
            if (currentData) {
                count = parseInt(currentData, 10);
            }
        }
        
        // 3. Tambah 1
        const newCount = count + 1;

        // 4. Simpan nilai baru (PUT) - WAJIB 'await'
        await fetch(DB_PATH, {
            method: 'PUT',
            body: JSON.stringify(newCount)
        });
        
        // 5. Kembalikan nilai BARU ke frontend
        return {
            statusCode: 200,
            // Header ini mengizinkan Anda tes dari 'localhost'
            // Di Netlify (domain yang sama), ini tidak wajib
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ count: newCount })
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

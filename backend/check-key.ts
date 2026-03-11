import dotenv from 'dotenv';
dotenv.config();

async function checkApiKey() {
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log('--- Raw HTTP Discovery Check ---');
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ API Key is valid and authorized.');
            console.log('Available Models:', data.models?.map((m: any) => m.name).join(', ') || 'None found');
        } else {
            console.log(`❌ API Error: ${response.status} ${response.statusText}`);
            console.log('Response Body:', JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('Fetch failed:', err);
    }
}

checkApiKey();

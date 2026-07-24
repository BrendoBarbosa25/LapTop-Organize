import 'dotenv/config';

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const DATABASE_ID = process.env.CF_DATABASE_ID;
const API_TOKEN = process.env.CF_API_TOKEN;

const D1_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
                
console.log("URL montada:", D1_URL);
console.log("Account ID:", JSON.stringify(ACCOUNT_ID));
console.log("Database ID:", JSON.stringify(DATABASE_ID));
console.log("Token começa com:", API_TOKEN?.slice(0, 8));

export async function d1Query(sql, params = []) {
    const response = await fetch(D1_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql, params })
    });

    console.log("Status da resposta:", response.status);

    const texto = await response.text();

    let dados;
    try {
        dados = JSON.parse(texto);
    } catch {
        console.log("Resposta não é JSON, veio isso:", texto.slice(0, 300));
        throw new Error("Resposta inesperada da API do Cloudflare");
    }

    if (!dados.success) {
        throw new Error(JSON.stringify(dados.errors));
    }

    return dados.result[0].results;
}
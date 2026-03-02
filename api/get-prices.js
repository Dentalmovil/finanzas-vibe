// api/get-prices.js
export default async function handler(req, res) {
  try {
    // Lista completa de las monedas que añadimos al script.js
    const coins = 'bitcoin,ethereum,binancecoin,solana,ripple';
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coins}&vs_currencies=usd&include_24hr_change=true`
    );
    
    const data = await response.json();
    
    // Devolvemos los datos a tu App
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los precios' });
  }
}

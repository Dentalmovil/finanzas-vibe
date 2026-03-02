// api/get-prices.js
export default async function handler(req, res) {
  try {
    // Definimos exactamente las 4 monedas: Bitcoin, Ethereum, Binance Coin y PAX Gold
    const coins = 'bitcoin,ethereum,binancecoin,pax-gold';

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coins}&vs_currencies=usd&include_24hr_change=true`
    );

    if (!response.ok) {
      throw new Error('Error en la respuesta de CoinGecko');
    }

    const data = await response.json();

    // Devolvemos los datos a tu App
    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ 
      error: 'Error al obtener los precios',
      details: error.message 
    });
  }
}


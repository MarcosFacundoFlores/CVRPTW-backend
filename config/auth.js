const axios = require("axios");
const qs = require("qs");

let cosToken = null;
let tokenExpiration = null; // Momento en que el token expira

let runtimeToken = null;
let runtimeExpiration = null;

// Función para obtener un nuevo token
const getCosToken = async () => {
  try {
    let data = qs.stringify({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: process.env.IBM_API_KEY, // Usa la API Key desde .env
    });

    let config = {
      method: "post",
      url: "https://iam.cloud.ibm.com/identity/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    cosToken = response.data.access_token;
    tokenExpiration = Date.now() + response.data.expires_in * 1000; // Guardamos la expiración

    console.log("🔑 Token de COS actualizado correctamente.");
  } catch (error) {
    console.error("❌ Error obteniendo token COS:", error.response?.data || error);
    throw new Error("No se pudo obtener el token de COS");
  }
};

const getRuntimeToken = async () => {
  try {
    let data = qs.stringify({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: process.env.WATSON_API_KEY, // Usa la API Key de Watson desde .env
    });

    let config = {
      method: "post",
      url: "https://iam.cloud.ibm.com/identity/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    runtimeToken = response.data.access_token;
    runtimeExpiration = Date.now() + response.data.expires_in * 1000;

    console.log("🔑 Token de Runtime actualizado correctamente.");
  } catch (error) {
    console.error("❌ Error obteniendo token de Runtime:", error.response?.data || error);
    throw new Error("No se pudo obtener el token de Runtime");
  }
};

// Middleware para asegurar que el token esté actualizado
const ensureCosToken = async (req, res, next) => {
  if (!cosToken || Date.now() >= tokenExpiration) {
    await getCosToken();
  }
  req.cosToken = cosToken;
  next();
};

const ensureRuntimeToken = async (req, res, next) => {
  if (!runtimeToken || Date.now() >= runtimeExpiration) {
    await getRuntimeToken();
  }
  req.runtimeToken = runtimeToken;
  next();
};

module.exports = { ensureCosToken, ensureRuntimeToken, getCosToken, getRuntimeToken };

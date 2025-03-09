const axios = require("axios");

// Función para subir archivos a COS
const uploadToCos = async (bucketName, fileName, fileData, token) => {
  const cosUrl = `https://${process.env.ENDPOINT_REGION}.cloud-object-storage.appdomain.cloud/${bucketName}/${fileName}`;

  try {
    await axios.put(cosUrl, fileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/csv",
      },
    });

    console.log(`✅ Archivo "${fileName}" subido a COS`);
    return { success: true, fileName };
  } catch (error) {
    console.error(`❌ Error al subir "${fileName}" a COS:`, error.response?.data || error);
    throw new Error(`No se pudo subir "${fileName}"`);
  }
};

module.exports = { uploadToCos };

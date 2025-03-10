const express = require("express");
const { ensureCosToken } = require("../config/auth");
const { jsonToCsv, csvHeaders } = require("../utils/csvHelper");
const { uploadToCos } = require("../utils/cosHelper");

const router = express.Router();

// Guardar configuración en COS
router.put("/saveConfig", ensureCosToken, async (req, res) => {
  try {
    console.log("📝 Recibido en /saveConfig:", req.body);
    const { config } = req.body;
    if (!config) return res.status(400).json({ error: "Falta el campo 'config'" });

    const csvData = jsonToCsv(config, csvHeaders.config);
    const response = await uploadToCos(process.env.BUCKET_NAME, "config.csv", csvData, req.cosToken);

    res.json({ message: "Archivo config subido a COS", fileName: response.fileName });
  } catch (error) {
    res.status(500).json({ error: "Error al subir config", details: error.message });
  }
});

// Guardar nodos de clientes en COS
router.put("/saveCustNode", ensureCosToken, async (req, res) => {
  try {
    const { custNode } = req.body;
    if (!custNode || !Array.isArray(custNode) || custNode.length === 0) {
      return res.status(400).json({ error: "Falta el campo 'custNode' o está vacío" });
    }

    const csvData = jsonToCsv(custNode, csvHeaders.custNode);
    const response = await uploadToCos(process.env.BUCKET_NAME, "custNode.csv", csvData, req.cosToken);

    res.json({ message: "Archivo custNode subido a COS", fileName: response.fileName });
  } catch (error) {
    console.error("❌ Error al subir custNode:", error.response?.data || error);
    res.status(500).json({ error: "Error al subir custNode", details: error.message });
  }
});

module.exports = router;

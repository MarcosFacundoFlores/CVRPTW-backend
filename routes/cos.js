const express = require("express");
const { ensureCosToken } = require("../config/auth");
const { jsonToCsv, csvHeaders } = require("../utils/csvHelper");
const { uploadToCos } = require("../utils/cosHelper");

const router = express.Router();

// Guardar configuración en COS
router.post("/saveConfig", ensureCosToken, async (req, res) => {
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
router.post("/saveCustNode", ensureCosToken, async (req, res) => {
  try {
    const { custNode } = req.body;
    if (!custNode) return res.status(400).json({ error: "Falta el campo 'custNode'" });

    const csvData = jsonToCsv(custNode, csvHeaders.custNode);
    const response = await uploadToCos(process.env.BUCKET_NAME, "custNode.csv", csvData, req.cosToken);

    res.json({ message: "Archivo custNode subido a COS", fileName: response.fileName });
  } catch (error) {
    res.status(500).json({ error: "Error al subir custNode", details: error.message });
  }
});

module.exports = router;

const express = require("express");
const { ensureCosToken } = require("../config/auth");
const { jsonToCsv, csvHeaders, csvToJson } = require("../utils/csvHelper");
const { uploadToCos, fetchFile, getFileUrl } = require("../utils/cosHelper");

const router = express.Router();

// Guardar configuración en COS
router.put("/saveConfig", ensureCosToken, async (req, res) => {
  try {
    console.log("📝 Recibido en /saveConfig:", req.body);
    const { config } = req.body;
    if (!config) return res.status(400).json({ error: "Falta el campo 'config'" });

    const csvData = jsonToCsv(config, csvHeaders.config);
    const response = await uploadToCos(process.env.BUCKET_NAME, "Config.csv", csvData, req.cosToken);

    res.json({ message: "Archivo config subido a COS", fileName: response.fileName });
  } catch (error) {
    res.status(500).json({ error: "Error al subir config", details: error.message });
  }
});

router.get("/getConfig", ensureCosToken, async (req, res) => {
  try {
    const fileUrl = await getFileUrl("Config.csv");
    const response = await fetchFile(fileUrl, req.cosToken);
    const jsonData = await csvToJson(response.data);
    res.json({ status: "OK", data: jsonData });
  } catch (error) {
    console.error("❌ Error Procesando los Resultados desde COS:", error.response?.data || error);
    res.status(500).json({ error: "Error Procesando los Resultados", details: error.message });
  }
});

router.get("/getcustNodes", ensureCosToken, async (req, res) => {
  try {
    
    const fileUrl = await getFileUrl("custNode.csv");
    const response = await fetchFile(fileUrl, req.cosToken);
    const jsonData = await csvToJson(response.data);
    console.log("GET /getcustNodes status: 200");
    res.json({ status: "OK", data: jsonData });
  } catch (error) {
    console.log("GET /getcustNodes status: 500");
    console.error("❌ Error Procesando los Resultados desde COS:", error.response?.data || error);
    res.status(500).json({ error: "Error Procesando los Resultados", details: error.message });
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

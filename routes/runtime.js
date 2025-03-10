const express = require("express");
const axios = require("axios");
const { ensureRuntimeToken, ensureCosToken } = require("../config/auth");
const { csvToJson } = require("../utils/csvHelper");

const router = express.Router();

// 📌 Ejecutar un job en IBM Cloud
router.post("/execute", ensureRuntimeToken, async (req, res) => {
  try {
    const url = `https://api.dataplatform.cloud.ibm.com/v2/jobs/${process.env.JOB_ID}/runs?space_id=${process.env.SPACE_ID}`;

    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${req.runtimeToken}`,
        "Content-Type": "application/json",
      },
    });

    res.json({ message: "Job ejecutado" });
  } catch (error) {
    console.error("❌ Error ejecutando el job:", error.response?.data || error);
    res.status(500).json({ error: "Error ejecutando el job", details: error.message });
  }
});

// 📌 Obtener resultados del job desde COS
router.get("/results", ensureCosToken, async (req, res) => {
    try {
      const fileUrl = `https://${process.env.ENDPOINT_REGION}.cloud-object-storage.appdomain.cloud/${process.env.BUCKET_NAME}/res-nodeVehicles.csv`;
  
      const response = await axios.get(fileUrl, {
        headers: { Authorization: `Bearer ${req.cosToken}` },
        responseType: "stream",
      });
  
      const jsonData = await csvToJson(response.data);
  
      res.json({ message: "Resultados Procesados Correctamente", data: jsonData });
    } catch (error) {
      console.error("❌ Error Procesando los Resultados desde COS:", error.response?.data || error);
      res.status(500).json({ error: "Error Procesando los Resultados", details: error.message });
    }
  });

module.exports = router;

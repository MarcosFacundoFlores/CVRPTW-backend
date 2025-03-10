require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ensureCosToken, ensureRuntimeToken } = require("./config/auth.js");

const cosRoutes = require("./routes/cos");
const resolveRoutes = require("./routes/runtime");



const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", cosRoutes);
app.use("/api/v1/resolve", resolveRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

app.get("/test-auth", ensureCosToken, (req, res) => {
    res.json({ message: "Cloud Token válido", token: req.cosToken });
  });

app.get("/test-runtime", ensureRuntimeToken, (req, res) => {
  res.json({ message: "Token de Runtime válido", token: req.runtimeToken });
  });
  
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

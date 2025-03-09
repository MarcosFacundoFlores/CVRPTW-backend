require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ensureCosToken } = require("./config/auth.js");
const cosRoutes = require("./routes/cos");



const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", cosRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

app.get("/test-auth", ensureCosToken, (req, res) => {
    res.json({ message: "Token válido", token: req.cosToken });
  });
  

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

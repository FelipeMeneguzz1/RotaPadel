require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pingDB } = require("./db");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes"); // <-- Adicionado aqui

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Rotas
app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    const info = await pingDB();
    console.log(`DB OK: ${info.version} | ${info.now}`);
  } catch (err) {
    console.error("Falha ao conectar no banco:", err.message);
  }
  console.log(`API rodando em http://localhost:${PORT}`);
});

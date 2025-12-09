require('dotenv').config();
import app from "./app";
import { initializeDatabase } from "./seed"; // Importar el seed

const PORT = process.env.PORT || 3000;

// Inicializamos la BD en cada arranque (para DigitalOcean App Platform)
initializeDatabase();

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})
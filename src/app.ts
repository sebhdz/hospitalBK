import express, { Application } from "express";
import cors from "cors"; // <--- 1. ASEGÚRATE DE QUE ESTO ESTÉ AQUÍ

// Importación de Rutas
import citas_routes from "./routes/citas_routes";
import paciente_routes from "./routes/pacientes_routes";
import pagos_routes from "./routes/pagos_routes";
import personal_routes from "./routes/personal_routes";

const app: Application = express();

// ==========================================
// MIDDLEWARES (Configuraciones)
// ==========================================

// 2. ¡ESTO ES LO MÁS IMPORTANTE!
// Tiene que estar ANTES de las rutas.
app.use(cors()); 

app.use(express.json());

// ==========================================
// RUTAS
// ==========================================
app.use('/citas', citas_routes);
app.use('/pacientes', paciente_routes); // El front llama a este, CORS debe activarse antes
app.use('/pagos', pagos_routes);
app.use('/medicos', personal_routes);

export default app;
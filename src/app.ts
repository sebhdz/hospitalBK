import express, { Application } from "express";
import cors from "cors";

// Importación de Rutas
import citas_routes from "./routes/citas_routes";
import paciente_routes from "./routes/pacientes_routes";
import pagos_routes from "./routes/pagos_routes";
import personal_routes from "./routes/personal_routes";
import notas_routes from "./routes/notas_routes";
import historial_routes from "./routes/historial_routes";
import recetas_routes from "./routes/recetas_routes";
import quirofano_routes from "./routes/quirofano_routes";
import admin_routes from "./routes/admin_routes";

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use('/citas', citas_routes);
app.use('/pacientes', paciente_routes);
app.use('/pagos', pagos_routes);
app.use('/medicos', personal_routes);
app.use('/notas', notas_routes);
app.use('/historial', historial_routes);
app.use('/recetas', recetas_routes);
app.use('/quirofano', quirofano_routes);
app.use('/admin', admin_routes);

// Servir archivos estáticos del frontend (carpeta 'dist' en la raíz)
import path from 'path';
app.use(express.static(path.join(__dirname, '../public/dist')));

// Manejar cualquier ruta no reconocida devolviendo el index.html (para SPAs como React/Vue)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dist/index.html'));
});

export default app;
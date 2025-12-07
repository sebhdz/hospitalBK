import express, {Application, Request, Response} from "express";
import citas_routes from "./routes/citas_routes";
import paciente_routes from "./routes/pacientes_routes";
import pagos_routes from "./routes/pagos_routes";

const app: Application = express();
app.use(express.json());

app.use('/citas', citas_routes);

app.use('/pacientes', paciente_routes);

app.use('/pagos', pagos_routes);

export default app;
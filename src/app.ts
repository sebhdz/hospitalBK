import express, {Application, Request, Response} from "express";
import citas_routes from "./routes/citas_routes";
import paciente_routes from "./routes/pacientes_routes";

const app: Application = express();
app.use(express.json());

app.use('/citas', citas_routes);

app.use('/pacientes', paciente_routes);

export default app;
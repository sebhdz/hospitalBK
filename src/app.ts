import express, {Application, Request, Response} from "express";
import citas_routes from "./routes/citas_routes";

const app: Application = express();
app.use(express.json());

app.use('/citas', citas_routes);

export default app;
import { Router } from "express";
import {crearCita, getCitasPorDoctor} from "../controllers/citas_controller";
const router  = Router();

router.get('/:idDoctor', getCitasPorDoctor);
router.post('/', crearCita);

export default router;
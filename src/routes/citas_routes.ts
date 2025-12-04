import { Router } from "express";
import {crearCita, getCitasPorDoctor, actualizarCita} from "../controllers/citas_controller";
const router  = Router();

router.get('/:idDoctor', getCitasPorDoctor);
router.post('/', crearCita);
router.put('/', actualizarCita);

export default router;
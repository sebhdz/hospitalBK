import { Router } from "express";
import {crearCita, getCitasPorDoctor, actualizarCita, eliminarCita,obtenerTodasCitas} from "../controllers/citas_controller";
const router  = Router();

router.get('/', obtenerTodasCitas);
router.get('/:idDoctor', getCitasPorDoctor);
router.post('/', crearCita);
router.put('/', actualizarCita);
router.delete('/:idCita', eliminarCita);

export default router;
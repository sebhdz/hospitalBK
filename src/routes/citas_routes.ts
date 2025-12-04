import { Router } from "express";
import {getCitasPorDoctor} from "../controllers/citas_controller";
const router  = Router();

router.get('/:idDoctor', getCitasPorDoctor);

export default router;
import { Router } from 'express';
import { crearReceta, obtenerRecetasPorPaciente } from '../controllers/recetas_controller';

const router = Router();

router.post('/', crearReceta);
router.get('/paciente/:idPaciente', obtenerRecetasPorPaciente);

export default router;

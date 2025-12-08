import { Router } from 'express';
import { obtenerHistorial, actualizarHistorial } from '../controllers/historial_controller';

const router = Router();
router.get('/:idPaciente', obtenerHistorial);

router.put('/:idPaciente', actualizarHistorial);

export default router;
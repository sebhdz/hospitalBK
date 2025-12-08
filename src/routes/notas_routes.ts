import { Router } from 'express';
import { obtenerNotasPorPaciente, crearNota } from '../controllers/notas_controller';

const router = Router();

router.get('/paciente/:idPaciente', obtenerNotasPorPaciente);

router.post('/', crearNota);

export default router;
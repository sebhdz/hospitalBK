import { Router } from 'express';
import { 
    obtenerPacientes, 
    obtenerPacientePorId, 
    crearPaciente, 
    actualizarPaciente,
    eliminarPaciente
} from '../controllers/pacientes_controller';
const router = Router();

router.get('/', obtenerPacientes);
router.get('/:id', obtenerPacientePorId);
router.post('/', crearPaciente);
router.put('/:id', actualizarPaciente);
router.delete('/:id', eliminarPaciente);

export default router;
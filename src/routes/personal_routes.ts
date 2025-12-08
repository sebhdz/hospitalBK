import { Router } from 'express';
import { 
    obtenerMedicos, 
    crearMedico, 
    obtenerMedicoPorId, 
    eliminarMedico,
    actualizarMedico
} from '../controllers/personal_controller';

const router = Router();

router.get('/', obtenerMedicos);
router.get('/:id', obtenerMedicoPorId);
router.post('/', crearMedico);
router.delete('/:id', eliminarMedico);
router.put('/:id', actualizarMedico);

export default router;
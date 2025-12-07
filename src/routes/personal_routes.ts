import { Router } from 'express';
import { 
    obtenerMedicos, 
    crearMedico, 
    obtenerMedicoPorId, 
    eliminarMedico 
} from '../controllers/personal_controller';

const router = Router();

router.get('/', obtenerMedicos);
router.get('/:id', obtenerMedicoPorId);
router.post('/', crearMedico);
router.delete('/:id', eliminarMedico);

export default router;
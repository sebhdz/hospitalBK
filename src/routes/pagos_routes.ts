import { Router } from 'express';
import { obtenerIngresos, crearPago } from '../controllers/pagos_controller';

const router = Router();

router.get('/ingresos', obtenerIngresos);
router.post('/', crearPago);

export default router;
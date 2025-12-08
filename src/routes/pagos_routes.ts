import { Router } from 'express';
import { obtenerIngresos, crearPago, obtenerTotalHoy } from '../controllers/pagos_controller';

const router = Router();

router.get('/ingresos', obtenerIngresos);
router.post('/', crearPago);
router.get('/hoy', obtenerTotalHoy);

export default router;
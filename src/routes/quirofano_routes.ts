import { Router } from 'express';
import { crearReserva, obtenerReservas } from '../controllers/quirofano_controller';

const router = Router();

router.post('/', crearReserva);
router.get('/', obtenerReservas);

export default router;

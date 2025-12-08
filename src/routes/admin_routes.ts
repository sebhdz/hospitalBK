import { Router } from 'express';
// Asegúrate de que el nombre del archivo del controlador sea correcto
import { obtenerRegistros } from '../controllers/admin_controller'; 

const router = Router();

// GET http://localhost:3000/admin/registros
router.get('/registros', obtenerRegistros);

export default router;
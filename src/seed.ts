import db from './database';

const limpiarDB = () => {
    console.log("🧹 Limpiando base de datos...");
    
    // 1. APAGAMOS la verificación de llaves foráneas temporalmente
    // Esto permite borrar tablas sin que SQLite se queje del orden
    db.exec("PRAGMA foreign_keys = OFF;");

    // 2. Borramos TODAS las tablas del sistema
    db.exec("DELETE FROM citas");
    db.exec("DELETE FROM recetas");           // <--- Agregado
    db.exec("DELETE FROM pagos");             // <--- Agregado
    db.exec("DELETE FROM logs_auditoria");    // <--- Agregado
    db.exec("DELETE FROM notas_clinicas");    // <--- Agregado
    db.exec("DELETE FROM historial_clinico"); // <--- Agregado
    db.exec("DELETE FROM personal_hospital");
    db.exec("DELETE FROM pacientes");
    
    // 3. Reiniciamos los contadores de ID (para que empiecen en 1 otra vez)
    db.exec("DELETE FROM sqlite_sequence");

    // 4. PRENDEMOS la seguridad de nuevo
    db.exec("PRAGMA foreign_keys = ON;");
};

const insertarMedicos = () => {
    const stmt = db.prepare(`
        INSERT INTO personal_hospital (
            nombres, apellidos, email, password, rol, 
            cedula_profesional, especialidad, turno, activo
        ) VALUES (?, ?, ?, '123', 'doctor', ?, ?, ?, 1)
    `);
    
    const docs = [
        ['Elena', 'García', 'elena.garcia@email.com', 'CP-98765', 'Cardiología', 'Lun-Vie 9:00-18:00'],
        ['Elizabeth', 'Reed', 'elizabeth.reed@clinicadental.mx', 'CED-1011223', 'Odontología General', 'Lun-Vie 9:00-18:00'],
        ['Sarah', 'Connor', 'sarah.connor@clinicadental.mx', 'CED-4044556', 'Pediatría', 'Mar-Sab 10:00-19:00'],
        ['James', 'Kim', 'james.kim@clinicadental.mx', 'CED-7077889', 'Cardiología', 'Lun-Vie 8:00-17:00'],
        ['Andrew', 'Grant', 'andrew.grant@clinicadental.mx', 'CED-9099112', 'Dermatología', 'Mier-Vie 12:00-20:00']
    ];

    for (const d of docs) {
        stmt.run(d[0], d[1], d[2], d[3], d[4], d[5]);
    }
    console.log(`✅ ${docs.length} Médicos insertados`);
};

const insertarPacientes = () => {
    const stmt = db.prepare(`
        INSERT INTO pacientes (
            nombres, apellidos, fecha_nacimiento, sexo, 
            telefono, email, direccion, contacto_emergencia
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const pacs = [
        ['Juan', 'Pérez', '1990-05-15', 'M', '555-1111', 'juan@test.com', 'Calle Falsa 123', 'Esposa (555-2222)'],
        ['Ana', 'López', '1985-10-20', 'F', '555-3333', 'ana@test.com', 'Av. Siempre Viva 742', 'Madre (555-4444)'],
        ['Carlos', 'Ruiz', '2000-01-01', 'M', '555-9999', 'carlos@test.com', 'Centro 12', 'Padre (555-8888)']
    ];

    for (const p of pacs) {
        stmt.run(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);
    }
    console.log(`✅ ${pacs.length} Pacientes insertados`);
};

const insertarCitas = () => {
    const stmt = db.prepare(`
        INSERT INTO citas (fecha_hora, motivo_consulta, estado, id_medico, id_paciente) 
        VALUES (?, ?, ?, ?, ?)
    `);
    
    // Citas variadas para ver movimiento en el dashboard
    // ID Medico 1 = Elena, ID Paciente 1 = Juan
    stmt.run('2025-12-01 10:00:00', 'Dolor en la pierna', 'Terminada', 1, 1);
    stmt.run('2025-12-05 12:00:00', 'Arritmia', 'Agendada', 1, 1);
    stmt.run('2025-12-06 09:00:00', 'Migraña severa', 'En curso', 4, 2); // James Kim con Ana
    stmt.run('2025-12-07 11:00:00', 'Limpieza dental', 'Cancelada', 2, 3); // Reed con Carlos
    stmt.run('2025-12-20 16:00:00', 'Control Pediátrico', 'Agendada', 3, 2); // Connor con Ana
    
    console.log("✅ Citas insertadas");
};

const insertarPagos = () => {
    const stmt = db.prepare(`
        INSERT INTO pagos (id_paciente, id_recepcionista, monto_total, metodo_pago, fecha_pago) 
        VALUES (?, ?, ?, ?, ?)
    `);
    
    // Pagos falsos para que la gráfica tenga datos
    stmt.run(1, 1, 500, 'Efectivo', '2025-12-01');
    stmt.run(1, 1, 1200, 'Tarjeta', '2025-12-02');
    stmt.run(2, 1, 800, 'Transferencia', '2025-12-03');
    console.log("✅ Pagos insertados (Gráfica lista)");
};

try {
    limpiarDB();
    insertarMedicos();
    insertarPacientes();
    insertarCitas();
    insertarPagos();
    console.log("🚀 ¡Base de datos repoblada y lista para demo!");
} catch (err) {
    console.error("❌ Error al sembrar datos:", err);
}
import db from './database';

const limpiarDB = () => {
    console.log("🧹 Limpiando base de datos...");
    db.exec("PRAGMA foreign_keys = OFF;");
    
    // Borramos en orden para evitar errores
    db.exec("DELETE FROM notas_clinicas");
    db.exec("DELETE FROM historial_clinico");
    db.exec("DELETE FROM recetas");
    db.exec("DELETE FROM pagos");
    db.exec("DELETE FROM citas");
    db.exec("DELETE FROM personal_hospital");
    db.exec("DELETE FROM pacientes");
    db.exec("DELETE FROM sqlite_sequence"); // Reinicia los IDs a 1

    db.exec("PRAGMA foreign_keys = ON;");
};

const insertarMedicos = () => {
    const stmt = db.prepare(`INSERT INTO personal_hospital (nombres, apellidos, email, password, rol, cedula_profesional, especialidad, turno, activo) VALUES (?, ?, ?, '123', 'doctor', ?, ?, ?, 1)`);
    const docs = [
        ['Elena', 'García', 'elena.garcia@email.com', 'CP-98765', 'Cardiología', 'Lun-Vie 9:00-18:00'],
        ['Elizabeth', 'Reed', 'elizabeth.reed@clinicadental.mx', 'CED-1011223', 'Odontología General', 'Lun-Vie 9:00-18:00'],
        ['Sarah', 'Connor', 'sarah.connor@clinicadental.mx', 'CED-4044556', 'Pediatría', 'Mar-Sab 10:00-19:00'],
        ['James', 'Kim', 'james.kim@clinicadental.mx', 'CED-7077889', 'Cardiología', 'Lun-Vie 8:00-17:00'],
        ['Andrew', 'Grant', 'andrew.grant@clinicadental.mx', 'CED-9099112', 'Dermatología', 'Mier-Vie 12:00-20:00']
    ];
    for (const d of docs) stmt.run(d[0], d[1], d[2], d[3], d[4], d[5]);
    console.log(`✅ ${docs.length} Médicos insertados`);
};

const insertarPacientes = () => {
    // CORRECCIÓN: Agregamos la columna 'alergias' al INSERT
    const stmt = db.prepare(`
        INSERT INTO pacientes (
            nombres, apellidos, fecha_nacimiento, sexo, 
            telefono, email, direccion, contacto_emergencia, alergias
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const pacs = [
        ['Juan', 'Pérez', '1990-05-15', 'M', '555-1111', 'juan@test.com', 'Calle Falsa 123', 'Esposa (555-2222)', 'Penicilina'],
        ['Ana', 'López', '1985-10-20', 'F', '555-3333', 'ana@test.com', 'Av. Siempre Viva 742', 'Madre (555-4444)', 'Ninguna'],
        ['Carlos', 'Ruiz', '2000-01-01', 'M', '555-9999', 'carlos@test.com', 'Centro 12', 'Padre (555-8888)', 'Polvo y Polen']
    ];

    for (const p of pacs) {
        // Pasamos el 9no parámetro (alergias)
        stmt.run(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8]);
    }
    console.log(`✅ ${pacs.length} Pacientes insertados (Con alergias)`);
};

const insertarDatosClinicos = () => {
    // 1. Abrir Historiales (Para Juan, Ana y Carlos)
    const stmtHistorial = db.prepare(`INSERT INTO historial_clinico (id_paciente, tipo_sangre, antecedentes_hered, antecedentes_patol) VALUES (?, ?, ?, ?)`);
    stmtHistorial.run(1, 'O+', 'Diabetes paterna', 'Ninguno');
    stmtHistorial.run(2, 'A-', 'Hipertensión materna', 'Asma leve');
    stmtHistorial.run(3, 'B+', 'Ninguno', 'Alergia a AINES');

    // 2. Crear Notas Clínicas (Signos vitales iniciales)
    const stmtNotas = db.prepare(`INSERT INTO notas_clinicas (fecha_hora, peso_kg, altura_cm, presion_arterial, temperatura_c, saturacion_oxigeno, diagnostico, plan_tratamiento, id_historial, id_medico) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    // Nota para Juan (Historial 1)
    stmtNotas.run('2025-11-20 10:00:00', 80.5, 175.0, '120/80', 36.5, 98.0, 'Chequeo anual', 'Dieta baja en sodio', 1, 1);
    // Nota para Ana (Historial 2)
    stmtNotas.run('2025-12-05 11:30:00', 65.0, 160.0, '110/70', 37.0, 99.0, 'Infección estacional', 'Reposo 3 días', 2, 3);
    
    console.log("✅ Datos Clínicos (Peso, Altura, Historial) insertados");
};

const insertarCitas = () => {
    const stmt = db.prepare(`INSERT INTO citas (fecha_hora, motivo_consulta, estado, id_medico, id_paciente) VALUES (?, ?, ?, ?, ?)`);
    stmt.run('2025-12-01 10:00:00', 'Dolor en la pierna', 'Terminada', 1, 1);
    stmt.run('2025-12-05 12:00:00', 'Arritmia', 'Agendada', 1, 1);
    stmt.run('2025-12-06 09:00:00', 'Migraña severa', 'En curso', 4, 2); 
    stmt.run('2025-12-20 16:00:00', 'Control Pediátrico', 'Agendada', 3, 2);
    console.log("✅ Citas insertadas");
};

const insertarPagos = () => {
    const stmt = db.prepare(`INSERT INTO pagos (id_paciente, id_recepcionista, monto_total, metodo_pago, fecha_pago) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(1, 1, 500, 'Efectivo', '2025-12-01');
    stmt.run(1, 1, 1200, 'Tarjeta', '2025-12-02');
    console.log("✅ Pagos insertados");
};

try {
    limpiarDB();
    insertarMedicos();
    insertarPacientes();
    insertarDatosClinicos(); // <--- ¡IMPORTANTE!
    insertarCitas();
    insertarPagos();
    console.log("🚀 ¡Base de datos lista para demo!");
} catch (err) {
    console.error("❌ Error al sembrar datos:", err);
}
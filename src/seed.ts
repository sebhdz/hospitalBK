import db from './database';

const SCHEMA_SQL = `
DROP TABLE IF EXISTS pacientes;
CREATE TABLE pacientes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(1) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    direccion VARCHAR(255) NOT NULL,
    alergias TEXT,
    contacto_emergencia VARCHAR(100)
);

DROP TABLE IF EXISTS personal_hospital;
CREATE TABLE personal_hospital(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    rol CHECK ( rol in ('doctor', 'enfermero', 'recepcionista', 'administrativo')),
    cedula_profesional VARCHAR(50) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    turno VARCHAR(50) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT 1
);

DROP TABLE IF EXISTS historial_clinico;
CREATE TABLE historial_clinico(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_paciente INTEGER NOT NULL,
    fecha_apertura DATE DEFAULT CURRENT_DATE,
    tipo_sangre VARCHAR(3) NOT NULL,
    antecedentes_hered TEXT,
    antecedentes_patol TEXT,
    FOREIGN KEY(id_paciente) REFERENCES pacientes(id)
);

DROP TABLE IF EXISTS citas;
CREATE TABLE citas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_hora DATETIME NOT NULL,
    motivo_consulta VARCHAR(100) NOT NULL,
    estado CHECK ( estado in ('agendada', 'en curso', 'terminada', 'cancelada')) DEFAULT 'agendada',
    id_medico INTEGER NOT NULL,
    id_paciente INTEGER NOT NULL,
    FOREIGN KEY(id_medico) REFERENCES personal_hospital(id),
    FOREIGN KEY(id_paciente) REFERENCES pacientes(id)
);

DROP TABLE IF EXISTS recetas;
CREATE TABLE recetas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_emision DATE DEFAULT CURRENT_DATE,
    medicamentos TEXT NOT NULL,
    indicaciones TEXT NOT NULL,
    id_paciente INTEGER NOT NULL,
    id_medico INTEGER NOT NULL,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id),
    FOREIGN KEY (id_medico) REFERENCES personal_hospital(id)
);

DROP TABLE IF EXISTS reservas_quirofano;
CREATE TABLE reservas_quirofano(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_medico INTEGER NOT NULL,
    id_paciente INTEGER NOT NULL,
    sala VARCHAR(50) NOT NULL,
    tipo_cirugia VARCHAR(100) NOT NULL,
    fecha_hora DATETIME NOT NULL,
    FOREIGN KEY (id_medico) REFERENCES personal_hospital(id),
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id)
);

DROP TABLE IF EXISTS pagos;
CREATE TABLE pagos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_paciente INTEGER NOT NULL,
    id_recepcionista INTEGER NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    fecha_pago DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id),
    FOREIGN KEY (id_recepcionista) REFERENCES personal_hospital(id)
);

DROP TABLE IF EXISTS logs_auditoria;
CREATE TABLE logs_auditoria(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accion VARCHAR(50) NOT NULL,
    tabla_afectada VARCHAR(50) NOT NULL,
    valores_anteriores TEXT,
    valores_nuevos TEXT,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INTEGER NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES personal_hospital(id)
);

DROP TABLE IF EXISTS notas_clinicas;
CREATE TABLE notas_clinicas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_hora DATETIME NOT NULL,
    peso_kg DECIMAL(5,2) NOT NULL,
    altura_cm DECIMAL(5,2) NOT NULL,
    presion_arterial VARCHAR(10) NOT NULL,
    temperatura_c DECIMAL(4,2) NOT NULL,
    saturacion_oxigeno DECIMAL(4,2) NOT NULL,
    diagnostico TEXT NOT NULL,
    plan_tratamiento TEXT NOT NULL,
    id_historial INTEGER NOT NULL,
    id_medico INTEGER NOT NULL,
    FOREIGN KEY (id_medico) REFERENCES personal_hospital(id),
    FOREIGN KEY (id_historial) REFERENCES historial_clinico(id)
);
`;

const crearTablas = () => {
    console.log("🏗️ Creando tablas...");
    db.exec(SCHEMA_SQL);
};


const limpiarDB = () => {
    // Ya no es estrictamente necesario si hacemos DROP TABLE, pero lo dejamos por si acaso
    console.log("🧹 Limpiando base de datos...");
    // ... (omitimos el content para brevedad, usamos crearTablas que hace DROPs)
};

const insertarMedicos = () => {
    const stmt = db.prepare(`INSERT INTO personal_hospital (nombres, apellidos, email, password, rol, cedula_profesional, especialidad, turno, activo) VALUES (?, ?, ?, '123', ?, ?, ?, ?, 1)`);
    const docs = [
        ['Elena', 'García', 'elena.garcia@email.com', 'recepcionista', 'CP-98765', 'Cardiología', 'Lun-Vie 9:00-18:00'],
        ['Elizabeth', 'Reed', 'elizabeth.reed@clinicadental.mx', 'doctor', 'CED-1011223', 'Odontología General', 'Lun-Vie 9:00-18:00'],
        ['Sarah', 'Connor', 'sarah.connor@clinicadental.mx', 'doctor', 'CED-4044556', 'Pediatría', 'Mar-Sab 10:00-19:00'],
        ['James', 'Kim', 'james.kim@clinicadental.mx', 'doctor', 'CED-7077889', 'Cardiología', 'Lun-Vie 8:00-17:00'], // Corregido el orden
        ['Andrew', 'Grant', 'root@admin.com', 'administrativo', 'CED-9099112', 'Dermatología', 'Mier-Vie 12:00-20:00'] // Corregido email
    ];
    // AHORA SÍ: Pasamos los 7 argumentos
    for (const d of docs) stmt.run(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
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
    stmt.run('2025-12-01 10:00:00', 'Dolor en la pierna', 'terminada', 1, 1);
    stmt.run('2025-12-05 12:00:00', 'Arritmia', 'agendada', 1, 1);
    stmt.run('2025-12-07 09:00:00', 'Migraña severa', 'en curso', 4, 2);
    stmt.run('2025-12-07 23:45:00', 'Control Pediátrico', 'agendada', 3, 2);
    console.log("✅ Citas insertadas");
};

const insertarPagos = () => {
    const stmt = db.prepare(`INSERT INTO pagos (id_paciente, id_recepcionista, monto_total, metodo_pago, fecha_pago) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(1, 1, 500, 'Efectivo', '2025-12-01');
    stmt.run(1, 1, 1200, 'Tarjeta', '2025-12-02');
    console.log("✅ Pagos insertados");
};

export const initializeDatabase = () => {
    try {
        console.log("⚙️ Inicializando base de datos...");
        db.exec("PRAGMA foreign_keys = OFF;");
        crearTablas(); // Esto hace DROP CREATE
        db.exec("PRAGMA foreign_keys = ON;");

        insertarMedicos();
        insertarPacientes();
        insertarDatosClinicos();
        insertarCitas();
        insertarPagos();
        console.log("🚀 ¡Base de datos lista para demo!");
    } catch (err) {
        console.error("❌ Error al inicializar DB:", err);
    }
};

// Si se ejecuta directamente este script
if (require.main === module) {
    initializeDatabase();
}
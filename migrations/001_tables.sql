
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
    rol VARCHAR(50) NOT NULL,
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
    estado CHECK ( estado in ('Agendada', 'En curso', 'Terminada', 'Cancelada')),
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

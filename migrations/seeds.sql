
INSERT INTO personal_hospital (email, password, nombres, apellidos, rol, cedula_profesional, especialidad, turno)
VALUES
('jsho@gmail', '12345', 'John', 'Sho', 'doctor', 'A12345', 'cirujano', 'matutino')
;

INSERT INTO pacientes (nombres, apellidos, fecha_nacimiento, sexo, telefono, email, direccion, alergias, contacto_emergencia)
VALUES
('Jane', 'Doe', '1990-05-15', 'F', '555-1234', 'janedoe@gmail.com', '123 Main St', 'Ninguna', 'John Doe: 555-5678')
;

INSERT INTO citas (fecha_hora, motivo_consulta, id_medico, id_paciente)
VALUES
('2024-07-01 10:00:00', 'Consulta general', 1, 1)
;
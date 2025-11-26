CREATE DATABASE axotlacuali CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE axotlacuali;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) DEFAULT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    rol ENUM('admin', 'usuario') DEFAULT 'usuario'
);

CREATE TABLE edificios (
    id_edificio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) DEFAULT NULL,
    descripcion TEXT,
    coordenadas VARCHAR(100),
    imagen VARCHAR(255) DEFAULT NULL
);

CREATE TABLE restaurantes (
  id_restaurantes INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  horario VARCHAR(100),
  tipo_comida VARCHAR(100),
  rango_precio VARCHAR(50),
  imagen VARCHAR(255),
  url_direccion VARCHAR(255)
);

CREATE TABLE menus (
  id_menu INT AUTO_INCREMENT PRIMARY KEY,
  id_restaurantes INT NOT NULL,
  plato VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2),
  precio_max DECIMAL(10,2),
  FOREIGN KEY (id_restaurantes) REFERENCES restaurantes(id_restaurantes)
    ON DELETE CASCADE
);

INSERT INTO restaurantes (nombre, descripcion, horario, tipo_comida, rango_precio, imagen, url_direccion) 
VALUES ('Cafetería Veterinaria', 'Aquí podrás disfrutar de deliciosos desayunos completos que te llenarán de energía, se encuentra justo dentro de las instalaciones de la facultad, puedes tomar como referencia el auditorio.', 'Lun - Dom: 8:00 - 20:00', 'Comida corrida y platillos rápidos', '$30 - $150', './videos/Cafe vete.mp4', 'https://www.google.com/maps/@19.6896373,-99.186863,19.5z?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D'),
('Cafetería Ingeniería','Ofrece una variedad de platillos para el desayuno, comida y cena. Ubicada dentro de la facultad de ingeniería, es una opción conveniente para estudiantes y personal.','Lun - Dom: 8:00 - 20:00','Comida corrida y platillos rápidos','$30 - $150','./videos/Cafe inge.mp4',''),
('Cafetería [tbd: carpas]', 'Ubicada en el área de el acceso principal, esta cafetería ofrece una variedad de platillos rápidos y económicos, ideal para estudiantes que buscan una comida rápida entre clases.', 'Lun - Dom: 7:30 - 20:00', 'Comida corrida y platillos rápidos', '$30 - $180', './videos/Cafe carpas.mp4', '');

INSERT INTO menus (id_restaurantes, plato, precio, precio_max) VALUES
('1','Desayuno completo','80','0'), 
('1','gordita rellena','35','0'),
('1','Bebidas','20','35'),
('2','Tacos de guisado','30','0'), 
('2','Torta de milanesa','55','0'),
('2','Bebidas','20','35'),
('3','Baggette de pollo','50','0'), 
('3','Hot dog','45','0'),
('3','Bebidas','20','40');
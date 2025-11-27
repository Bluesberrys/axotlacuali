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
VALUES ('Cafetería Veterinaria', 'Aquí podrás disfrutar de deliciosos desayunos completos que te llenarán de energía, se encuentra justo dentro de las instalaciones de la facultad, puedes tomar como referencia el auditorio.', 'Lun - Dom: 8:00 - 20:00', 'Comida corrida y platillos rápidos', '$30 - $150', './videos/cafe vete.mp4', 'https://www.google.com/maps/@19.6896373,-99.186863,19.5z?entry=ttu&g_ep=EgoyMDI1MTAyMC4wIKXMDSoASAFQAw%3D%3D'),
('Cafetería Ingeniería','Ofrece una variedad de platillos para el desayuno, comida y cena. Ubicada dentro de la facultad de ingeniería, es una opción conveniente para estudiantes y personal.','Lun - Dom: 8:00 - 20:00','Comida corrida y platillos rápidos','$30 - $150','./videos/cafe inge.mp4',''),
('Cafetería carpas', 'Ubicada en el área de el acceso principal, esta cafetería ofrece una variedad de platillos rápidos y económicos, ideal para estudiantes que buscan una comida rápida entre clases.', 'Lun - Dom: 7:30 - 20:00', 'Comida corrida y platillos rápidos', '$30 - $180', './videos/cafe carpas.mp4', ''),
('Cafeteria Administracion', 'Cafetería ubicada en la facultad de administración, ofrece una variedad de platillos rápidos y económicos, ideal para estudiantes y personal administrativo.', 'Lun - Dom: 8:00 - 19:00', 'Comida corrida y platillos rápidos', '$30 - $150', './videos/cafe admin.mp4', ''),
('Cafe Finca Sta. Veracruz', 'Cafetería que ofrece una variedad de platillos rápidos y bebidas, ideal para estudiantes y personal de la universidad.', 'Lun - Dom: 8:00 - 18:00', 'Comida corrida y platillos rápidos', '$25 - $100', './videos/cafe finca.mp4', ''),
('Tienda Biblioteca', 'Pequeña tienda ubicada a un costado de la biblioteca, ofrece snacks y bebidas.', 'Lun - Dom: 9:00 - 17:00', 'Snacks y bebidas', '$15 - $80', './videos/tienda blanca.mp4', ''),
('Tienda Veterinaria', 'Tienda ubicada dentro de la facultad de veterinaria, ofrece snacks, bebidas y algunos platillos rápidos.', 'Lun - Dom: 8:00 - 20:00', 'Snacks, bebidas y platillos rápidos', '$15 - $100', './videos/tienda vete.mp4', '');

INSERT INTO menus (id_restaurantes, plato, precio, precio_max) VALUES
('1','Desayuno completo','80','0'), 
('1','gordita rellena','35','0'),
('1','Bebidas','20','35'),
('2','Tacos de guisado','30','0'), 
('2','Torta de milanesa','55','0'),
('2','Bebidas','20','35'),
('3','Baggette de pollo','50','0'), 
('3','Hot dog','45','0'),
('3','Bebidas','20','40'),
('4','Hamburguesa sencilla','60','0'), 
('4','Ensalada César','70','0'),
('4','Bebidas','20','40'),
('5','Sándwich de pavo','55','0'), 
('5','Sopa instantánea','50','0'),
('5','Bebidas','20','90'),
('6','Snacks variados','15','0'), 
('6','Bebidas frías y calientes','15','25'),
('7','Platillos rápidos variados','30','0'), 
('7','Bebidas frías y calientes','15','25');
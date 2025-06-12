CREATE TABLE plantas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100)
);

CREATE TABLE racks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    planta_id INT,
    numero VARCHAR(10),
    descripcion TEXT,
    FOREIGN KEY (planta_id) REFERENCES plantas(id)
);

CREATE TABLE equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rack_id INT,
    nombre VARCHAR(255),
    ip VARCHAR(50),
    marca VARCHAR(100),
    modelo VARCHAR(100),
    funcion TEXT,
    etiquetas TEXT,
    FOREIGN KEY (rack_id) REFERENCES racks(id)
);

CREATE TABLE fotos_rack (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rack_id INT,
    url VARCHAR(255),
    orden INT,
    FOREIGN KEY (rack_id) REFERENCES racks(id)
);

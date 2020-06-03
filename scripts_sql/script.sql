CREATE DATABASE IF NOT EXISTS sk8spots;
USE sk8spots;

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'

CREATE TABLE tipo (
  id int NOT NULL,
  nome varchar(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY nome_UN (nome)
);

INSERT INTO tipo (id, nome) VALUES (1, 'SkatePark'), (2, 'Bowl'), (3, 'StreetSpot'), (4, 'DownHill'), (5, 'SkateShop');

CREATE TABLE local (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(100) NOT NULL,
  latitude float,
  longitude float,
  idtipo int NOT NULL,
  endereco varchar(100) NOT NULL,
  bairro varchar(50) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT local_idtipo_FK FOREIGN KEY (idtipo) REFERENCES tipo (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  UNIQUE KEY nome_UN (nome)
);

CREATE TABLE local_instalacao (
  idlocal int NOT NULL,
  idtipo int NOT NULL,
  PRIMARY KEY (idlocal, idtipo),
  CONSTRAINT idlocal_FK FOREIGN KEY (idlocal) REFERENCES local (id) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT idtipo_FK FOREIGN KEY (idtipo) REFERENCES tipo (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);

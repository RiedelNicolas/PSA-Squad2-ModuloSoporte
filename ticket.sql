""" DROP TABLE TICKETS; """
CREATE TABLE TICKETS (
	ID SERIAL PRIMARY KEY NOT NULL,
	NOMBRE TEXT NOT NULL,
	TIPO TEXT NOT NULL,
	SEVERIDAD INT NOT NULL,
	FECHA_CREACION bigint NOT NULL,
	FECHA_LIMITE bigint NOT NULL,
	ESTADO TEXT NOT NULL,
	CLIENTE INT NOT NULL,
	CREADOR TEXT NOT NULL,
	DESCRIPCION TEXT NOT NULL,
	RECURSO INT NOT NULL,
	PRODUCTO TEXT NOT NULL,
	VERSION TEXT NOT NULL
);


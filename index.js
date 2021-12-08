const express = require('express');
// para pullear a los clientes usamos cross fetch
const fetch = require('cross-fetch');

const PORT = process.env.PORT || 5000;
const { Pool, DatabaseError } = require('pg');

// la api de clientes
const clients_api = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/754f50e8-20d8-4223-bbdc-56d50131d0ae/clientes-psa/1.0.0/m/api/clientes";


const pool = new Pool({
  /*connectionString: process.env.DATABASE_URL,
 */
  host: "ec2-34-232-252-124.compute-1.amazonaws.com",
  user: "ujuualqljbjyqd",
  port: 5432,
  password: "48fa0a8e08d75e75ea8d0ef2802c768ce740ea99ee53dd1f07c2e88705ca08a4",
  database: "d7a6j8tg3e6ds1",
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(express.json());


const Severity = require('./severity_mapping.js');
const severityMapping = new Severity();

app.listen(PORT, () => {
  console.log(`Listening on ${ PORT }`)
});

// para tomar los clientes 
app.get('/clients', async (req, res) => {
  const clients = await fetch(clients_api)
  if (!clients.ok) {
    res.sendStatus(clients.status);
    return;
  } 
  res.statusCode = 200;
  res.send(await clients.json());
});

// base de api para tickets!
// este get nos devuelve todos los tickets de la base de datos
app.get('/tickets', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM TICKETS");
    res.send(result.rows);
    client.release();
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

// obtener ticket a través de su nombre
app.get('/tickets/:nombre', async (req, res) => {
  try {
    const client = await pool.connect();
    const ticketName = req.params.nombre;
    const result = await client.query(`SELECT * FROM TICKETS WHERE TICKETS.NOMBRE = '${ticketName}'`);
    client.release();
    if (!result.rows.length) {
      res.status(404).send("Ticket not found");
      return;
    }
    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.log(err);
    req.sendStatus(500);
  }
});

// borrar ticket
// solo se podra borrar si el ticket esta en estado === cerrado (criterios)
app.delete('/tickets/:nombre', async (req, res) => {
  debugger;
  const client = await pool.connect();
  const ticketName = req.params.nombre;
  const result = await client.query(`SELECT * FROM TICKETS WHERE TICKETS.NOMBRE = '${ticketName}'`);
  if (!result.rows.length) {
    res.status(404).send("Ticket not found");
    return;
  }
  if (result.rows[0].estado !== "cerrado") {
    res.status(400).send("Ticket not closed");
    return;
  }

  await client.query(`DELETE FROM TICKETS WHERE TICKETS.ID = ${result.rows[0].id}`);
  res.sendStatus(200);
});


app.post('/tickets', async (req ,res) => {
  const client = await pool.connect();
  let ticket = req.body;
  let ticketWithSameName = [];
  try {
    ticketWithSameName = await client.query(`SELECT * FROM TICKETS WHERE TICKETS.NOMBRE = '${ticket.nombre}'`);
  } catch (err) {
  }
  // Siguiendo los criterios de aceptacion
  // Si el nombre existe, no se crea
  if (ticketWithSameName.rows.length) {
    client.release();
    res.status(409).send("Cannot POST a ticket with repeated name");
    return;
  }

  let ticketCreationDate = new Date();
  let limitDate_ts = severityMapping.fromDateMapping(ticket.severidad, ticketCreationDate);
  let insertQuery = `INSERT INTO TICKETS(nombre, tipo, severidad, fecha_creacion, 
    fecha_limite, estado, cliente, creador, descripcion, recurso, producto, version) 
    VALUES('${ticket.nombre}', '${ticket.tipo}', ${ticket.severidad},
			${ticketCreationDate.getTime()}, ${limitDate_ts},
            '${ticket.estado}', '${ticket.cliente}', '${ticket.creador}', 
            '${ticket.descripcion}', '${ticket.recurso}', 
            '${ticket.producto}', '${ticket.version}')`;
  client.query(insertQuery, (err, res) => {
    if (err) {
      console.log(err.message);
      return;
    } 
  });
  res.status(201).send(req.body);
});

app.put('/tickets/:nombre', async (req ,res) => {
  const client = await pool.connect();
  const ticketName = req.params.nombre;
  const result = await client.query(`SELECT * FROM TICKETS WHERE TICKETS.NOMBRE = '${ticketName}'`);
  let ticketModifications = req.body;
  if (!result.rows.length) {
    res.status(404).send("Ticket not found");
    return;
  }
  try {
    if (ticketModifications.estado) {
      let modifyQuery = `UPDATE TICKETS SET estado = '${ticketModifications.estado}' where nombre = '${ticketName}'`;
      client.query(modifyQuery, (err, res) => {});
    }
    if (ticketModifications.severidad) {
      // reajustamos la fecha limite a partir de la fecha de creacion original del ticket (asumido)
      let creationDate = new Date(parseInt(result.rows[0].fecha_creacion));
      let limitDate_ts = severityMapping.fromDateMapping(ticketModifications.severidad, creationDate);
      let modifyQuery = `UPDATE TICKETS SET severidad = '${ticketModifications.severidad}', 
                         fecha_limite = '${limitDate_ts}' where nombre = '${ticketName}'`;
      client.query(modifyQuery, (err, res) => {});
    }
    if (ticketModifications.descripcion) {
      let modifyQuery = `UPDATE TICKETS SET descripcion = '${ticketModifications.descripcion}' where nombre = '${ticketName}'`;
      client.query(modifyQuery, (err, res) => {});
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    client.release();
    return;
  }
  client.release();
  res.sendStatus(200);
});
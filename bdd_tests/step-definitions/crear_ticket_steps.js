const expect = require('chai').expect;
const axios = require('axios').default;

const url = 'https://shielded-shelf-11253.herokuapp.com';

const axiosInstance = axios.create({
    baseUrl: url,
    timeout: 5000
  });
  

module.exports = function(){
    this.When('creo un ticket valido', async function(){

        const ticket_valido = {
            "nombre": "Nombre Tickets69",
            "tipo": "consulta",
            "severidad": 2,
            "estado": "abierto",
            "cliente": 3,
            "creador": "Tomás",
            "descripcion": "Descripcion del ticket",
            "recurso": 1,
            "tareas": [
              1
            ],
            "producto": "Siu Guarani",
            "version": "1.0.0"
          }
		let data = await axiosInstance.post(url + `/tickets`, ticket_valido);
        return data.rows;
    })

    this.Then('se crea en la base de datos', function(){})
};

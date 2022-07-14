

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Ejecuto la función main
//main();
gatos();


// Esquema condición Físico
const condiciónFisicaSchema = new mongoose.Schema({
    peso: Number,
    actividad: {
        type: String,
        enum: ["sedentaria", "activa", "deportista de elite"]
    },
    fumador: Boolean
});

// Esquema "Salir a correr"
const salirACorrerSchema = new mongoose.Schema({
    fecha: Date,
    distancia: Number,
    tiempo: Number // en minutos
});

// Esquema de usuario que se registra en la app
const usuarioSchema = new mongoose.Schema({
    nombre: String,
    edad: Number,
    condicionFisica: condiciónFisicaSchema,
    salirACorrer: [salirACorrerSchema]
});

const Usuario = mongoose.model("usuario", usuarioSchema);

async function main() {

    await mongoose.connect('mongodb+srv://root:root@cluster0.lo8dg.mongodb.net/runastic');
    console.log("Me he contactado a la BBDD");

    const nuevoUsuario = new Usuario({
        nombre: "Andreu",
        edad: 26,
        condicionFisica: {
            peso: 87,
            actividad: "activa",
            fumador: false,
        },
        salirACorrer: [
            {
                fecha: new Date("2020-01-01"),
                distancia: 100,
                tiempo: 10
            },
            {
                fecha: new Date("2020-01-02"),
                distancia: 200,
                tiempo: 20
            }
        ]
    });

    await nuevoUsuario.save();

    // mostrar por consola el usuario creado
    console.log(nuevoUsuario);


    mongoose.disconnect();
}

async function gatos() {
    await mongoose.connect('mongodb+srv://root:root@cluster0.lo8dg.mongodb.net/moonclinic');
    console.log("Me he contactado a la BBDD");

    // Apartado 1. Una Vacuna puede ser del tipo Calcivirus, Rinotraquetis o Panleucopenia. Debemos almancear la fecha de vacunación y un campo para anotar observaciones en el momento de administrar la vacuna
    const vacunaSchema = new mongoose.Schema({
        tipo: {
            type: String,
            enum: ["Calcivirus", "Rinotraquetis", "Panleucopenia"]
        },
        fecha: Date,
        observaciones: String
    });

    // Apartado 2. Diseña un esquema para representar un Gato.
    // Los gatos tiene un nombre, una fecha de nacimiento, y conjunto de vacunas 
    const gatoSchema = new mongoose.Schema({
        nombre: String,
        fechaNacimiento: Date,
        vacunas: [vacunaSchema]
    });

    // Crear la coleccion Gatos
    const Gato = mongoose.model("gato", gatoSchema);

    // Apartado 3. Crea una instancia de Gato y guardala en la BBDD.
    // Queremos crear un gato que se llama "Loki" que nació el 7 de septiembre de 2019. Le han administrado dos vacunas: Calcivirus y Rinotraquetis.(podeis inventaros la fecha). Para la vacuna de la Rinotraquetis, anotar en observaciones que Loki estuvo un poco perezoso durante un rato.

    const loki = new Gato({
        nombre: "Loki",
        fechaNacimiento: new Date("2019-09-07"),
        vacunas: [
            {
                tipo: "Calcivirus",
                fecha: new Date("2020-01-01"),
                observaciones: ""
            },
            {
                tipo: "Rinotraquetis",
                fecha: new Date(),
                observaciones: "Loki estuvo un poco perezoso durante un rato"
            },
            {
                tipo: "Calcivirus",
                fecha: new Date("2022-07-07"),
                observaciones: ""
            }
        ]
    });

    // guardar loki y mostrarlo por consola
    await loki.save();
    console.log(loki);


    await mongoose.disconnect();
}
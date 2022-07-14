

const mongoose = require('mongoose');
const { Schema } = mongoose;
const clienteSchema = new Schema({
    nombre: String,
    dni: String,
    coche: { type: mongoose.Schema.Types.ObjectId, ref: 'Coche' }
});

const cocheSchema = new Schema({
    modelo: String,
    matricula: String,
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' }
});

const Cliente = mongoose.model('Cliente', clienteSchema);
const Coche = mongoose.model('Coche', cocheSchema);
//main();

consultar();

async function consultar() {

    await mongoose.connect('mongodb+srv://root:root@cluster0.lo8dg.mongodb.net/mongocar');

    // Consultar que coche tiene alquilado Carlos
    const cliente = await Cliente.findOne({ dni: '12345678A' }).populate('coche');

    console.log("Que coche tiene alquilado Carlos? ", cliente);

    // Muestrame todos los coches libres
    const coches = await Coche.find({ cliente: null });
    console.log("Coches libres", coches);

    mongoose.disconnect();

}

async function main() {

    await mongoose.connect('mongodb+srv://root:root@cluster0.lo8dg.mongodb.net/mongocar');



    // Limpiar la base de datos inicial
    Cliente.deleteMany({});
    Coche.deleteMany({});

    const customer = new Cliente({
        dni: '12345678A',
        nombre: 'Carlos'
    });

    const customer_2 = new Cliente({
        dni: '12345678B',
        nombre: 'Juan'
    });

    const coche_astra = new Coche({
        matricula: '2134AZ',
        modelo: 'Opel Astra'
    });

    const coche_toyota = new Coche({
        matricula: '1234AB',
        modelo: 'Toyota'
    });

    // guardar todos los documentos en MongoDB
    await customer.save();
    await customer_2.save();
    await coche_astra.save();
    await coche_toyota.save();

    // Imaginar que Carlos quiere alquilar el coche Toyota

    // 1. Iria a su app de alquiler, y eligira la ficha del cliente (Carlos)
    // 2. Eliga el coche que quiere alquilar (Toyota)
    // 3. Asignaria el coche Toyota a Carlos

    // Seleccionar a Carlos en la app
    const customer_db = await Cliente.findOne({ dni: '12345678A' });

    console.log("Recuperamos a Carlos", customer_db);

    // Seleccionar el coche que quiere alquilar
    const coche_db = await Coche.findOne({ matricula: '1234AB' });
    console.log("Recuperamos el Toyota", coche_db);

    // Asignamos el coche Toyta a Carlos
    customer_db.coche = coche_db._id;
    console.log("Hemos asignado a la propiedad coche el ID del toyota", customer_db);


    // Especificamos que el coche Toyota está aqluilado a Carlos
    coche_db.cliente = customer_db._id;
    console.log("Hemos asignado en la propiedad cliente el ID de Carlos", coche_db);

    // Guardar los cambios. 
    await customer_db.save();
    await coche_db.save();

    mongoose.disconnect();
}


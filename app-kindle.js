const mongoose = require('mongoose');
const { Schema } = mongoose;


main();


// personSchema
// Una persona tiene un nombre, una edad y escribe un conjunto de stories (relatos)

async function main() {



    await mongoose.connect('mongodb+srv://root:root@cluster0.lo8dg.mongodb.net/kindle');
    console.log("Me he contactado a la BBDD");

    const personSchema = Schema({
        _id: Schema.Types.ObjectId,
        name: String,
        age: Number,
        stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
    });


    // Un Relato tiene un autor, que es un documento de la colección "Persons", tiene un título, tiene un conjunto de fans que ObjectID de documentos de la colección de la colección Persons
    const storySchema = Schema({
        author: { type: Schema.Types.ObjectId, ref: 'Person' },
        title: String,
        fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
    });

    const Story = mongoose.model('Story', storySchema);
    const Person = mongoose.model('Person', personSchema);


    await Story.deleteMany({});
    await Person.deleteMany({});

    // Creamos un Autor y un Relato
    const author = new Person({
        _id: new mongoose.Types.ObjectId(),
        name: 'Ian Fleming',
        age: 50
    });

    // Crear dos fans
    const fan_1 = new Person({
        _id: new mongoose.Types.ObjectId(),
        name: 'Enriqueta',
        age: 50
    });

    const fan_2 = new Person({
        _id: new mongoose.Types.ObjectId(),
        name: 'Manuela',
        age: 55
    });

    const fan_db_enriqueta = await fan_1.save();
    const fan_db_manuela = await fan_2.save();



    author.save(function (err) {
        if (err) return handleError(err);

        // Creamos el relato Casino Royale. Casino Royle en su campo author tiene asociado el ID del autor "Ian Fleming". En su campo "fans" tiene un ARRAY de ObjectID; los dos fans de la colección "Persons", Enriqueta y Manuela 
        const story1 = new Story({
            title: 'Casino Royale',
            author: author._id,
            fans: [fan_db_enriqueta._id, fan_db_manuela._id]    // assign the _id from the person

        });

        story1.save(function (err) {
            if (err) return handleError(err);
            // that's it!

        });
    });

    //await mongoose.disconnect();
}

function handleError(err) {
    console.log("Ha ocurrido un error", err);
}
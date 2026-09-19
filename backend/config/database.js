const {
    MongoClient,
    ServerApiVersion
} = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

let database;

async function connectDatabase() {

    try {

        await client.connect();

        await client
            .db("admin")
            .command({ ping: 1 });

        database =
            client.db(
                process.env.MONGODB_DATABASE
            );

        console.log(
            "MongoDB Atlas connected successfully!"
        );

        return database;

    } catch (error) {

        console.error(
            "MongoDB connection failed:",
            error
        );

        process.exit(1);
    }
}


function getDatabase() {

    if (!database) {

        throw new Error(
            "Database has not been connected yet."
        );

    }

    return database;
}


module.exports = {
    connectDatabase,
    getDatabase
};
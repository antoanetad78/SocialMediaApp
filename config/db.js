const mongoose = require('mongoose')
const config = require('config')
mongoose.set('useNewUrlParser', true);
const db = config.get('mongoURI')

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })

        console.log(`MongDB connected ...`);

    } catch (error) {
        console.error(error.message)
        //Exit process with failure
        process.exit(1)
    }
}

module.exports = connectDB
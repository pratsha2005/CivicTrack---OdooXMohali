import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path: './.env'
})

import { app } from "./app.js"
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`App is listening on port ${process.env.PORT || 8000}`)
    })
})
.catch((err) => {
    console.error("Mongo DB connection failed !!!", err)
})




































































































// ;(async () => {
//     try {
//       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//       console.log('Connected to MongoDB')
//       app.on('error', (error) => {
//         console.log("ERROR: ", error);
//         throw error
//       })

//       app.listen(process.env.PORT, () => {
//         console.log("App listening on port: ", process.env.PORT)
//       })
//     } catch (error) {
//         console.log("ERROR: ", error)
//     }
// })()

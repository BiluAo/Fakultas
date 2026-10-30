import app from './app.js'
import { connectDB } from './config/database.js'
import { APP_PORT } from './config/env.js'

await connectDB()

app.listen(APP_PORT, () => {
  console.log(`Example app listening on port ${APP_PORT}`)
})

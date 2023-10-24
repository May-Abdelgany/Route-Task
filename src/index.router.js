
import connectDB from '../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'
import categoryRouter from './modules/category/category.router.js'
import taskRouter from './modules/task/task.router.js'
import { globalErrorHandling } from './utils/errorHandling.js'
const bootstrap = (app, express) => {
    app.use(express.json())
    app.use("/auth", authRouter)
    app.use("/category", categoryRouter)
    app.use("/task", taskRouter)
    app.use("*", (req, res, next) => {
        return res.json({ message: "In-valid Routing" })
    });
    app.use(globalErrorHandling)
    connectDB()
}
export default bootstrap
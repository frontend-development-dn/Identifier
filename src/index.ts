import express from 'express';
import cors from 'cors';
import userRouter from "./router/user-router";
import {AppDataSource} from "./config/app-source";
import {config} from "dotenv";
import {clientAuthRouter} from "./router/client-auth";
import branchRouter from "./router/branch-router";

config();

const app = express();
const port = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Initializing db");
    })
    .catch(err => console.log(err));

app.use(cors());

app.use(express.json());

app.use('/Api/Users', userRouter);
app.use('/Api/Auth', clientAuthRouter);
app.use('/Api/Branches', branchRouter)

app.listen(port, () => console.log(`Listening on port ${port}`));
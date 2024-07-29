import {connect} from "mongoose";

async function connectDb() {
    try {
        await connect(process.env.MONGODB_URI!);
    } catch (error) {
        console.log(error);
        throw new Error("Couldn't connect Db");
    }
}

export {connectDb};


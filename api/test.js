import { connectDB } from "../db.js";

import Cors from "cors";

const cors = Cors({
    origin: "https://betting-frontend-delta.vercel.app", // Change this to your frontend URL in production
    methods: ["POST", "OPTIONS"],
});

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(req, res) {

    await runMiddleware(req, res, cors);

    console.log("Connecting to DB...");
    await connectDB();
    console.log("DB Connected!");

    res.status(200).json({ message: "Backend is working fine!" });
}

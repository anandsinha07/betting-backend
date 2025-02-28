import { connectDB, Outcome } from "../db";

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

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        await connectDB();

        const outcomeData = await Outcome.findOne({});
        if (!outcomeData) {
            return res.status(404).json({ error: "No outcome resolved yet" });
        }

        res.status(200).json({ outcome: outcomeData.outcome });
    } catch (error) {
        console.error("Error fetching outcome:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
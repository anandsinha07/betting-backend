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

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { outcome } = req.body;
    if (!outcome) {
        return res.status(400).json({ error: "Missing outcome" });
    }

    try {
        await connectDB();

        // Save the resolved outcome in the database (overwrite if it exists)
        await Outcome.findOneAndUpdate(
            {},
            { outcome },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: `Outcome resolved: ${outcome}` });
    } catch (error) {
        console.error("Error saving outcome:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
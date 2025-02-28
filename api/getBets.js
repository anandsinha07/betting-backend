import { connectDB, Bet } from "../db";

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

    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    try {
        await connectDB();
        const bets = await Bet.find();

        res.status(200).json(
            bets.map(bet => ({
                ...bet.toObject(),
                amount: bet.amount.toString()  // ✅ Convert BigInt to string
            }))
        );
    } catch (error) {
        console.error("Error fetching bets:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

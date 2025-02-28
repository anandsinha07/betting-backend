import { connectDB, Bet, Outcome } from "../db";

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
    // const { outcome } = req.body;
    // if (!outcome) return res.status(400).json({ error: "Missing outcome" });

    try {
        await connectDB();
        console.log("After====>>>>>>");
        const outcome = await Outcome.findOne().sort({ _id: -1 });
        console.log("outcome", outcome);
        const winners = await Bet.find({ outcome: outcome.outcome });

        if (winners.length === 0) return res.status(404).json({ error: "No winners found" });

        const payoutData = {
            outcome,
            winners: winners.map(bet => bet.user),
            amounts: winners.map(bet => (BigInt(bet.amount) * 2n).toString()) // ✅ Convert BigInt to String
        };

        res.status(200).json(payoutData);
    } catch (error) {
        console.error("Error fetching payout data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

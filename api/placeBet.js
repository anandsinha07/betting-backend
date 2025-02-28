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

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { user, amount, outcome } = req.body;
    if (!user || !amount || !outcome) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    await connectDB();

    // ✅ Check if user already placed a bet
    const existingBet = await Bet.findOne({ user });
    if (existingBet) {
        return res.status(400).json({ error: "You can only place one bet!" });
    }

    // ✅ If no existing bet, proceed to save the new bet
    const bet = new Bet({
        user,
        amount: BigInt(amount).toString(),  // Convert to String before saving
        outcome
    });

    await bet.save();

    return res.status(200).json({ message: "Bet placed successfully!" });
}



import mongoose from "mongoose";

const BetSchema = new mongoose.Schema({
    user: String,
    amount: String,
    outcome: String
});

const OutcomeSchema = new mongoose.Schema({
    outcome: { type: String, required: true }
});

// Export both models
export const Bet = mongoose.models.Bet || mongoose.model("Bet", BetSchema);
export const Outcome = mongoose.models.Outcome || mongoose.model("Outcome", OutcomeSchema);

export async function connectDB() {
    if (mongoose.connection.readyState !== 1) {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected!");
    }
}

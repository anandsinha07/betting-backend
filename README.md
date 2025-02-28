# 🏆 Betting Backend

This is the backend for a simple **pari-mutuel betting game**. It handles bet recording, fetching winners, and finalizing payouts using a **Node.js** and **Express** API, connected to a **MongoDB** database.

## 🚀 Features
- Store and manage bets off-chain
- Fetch winning outcome from the database
- Handle payouts on-chain via smart contract

---

## ⚙️ Installation & Setup

### **1️⃣ Clone the repository**
```bash
git clone https://github.com/anandsinha07/betting-backend.git
cd betting-backend

Install dependencies

yarn install

Create a .env file in the root directory and add:
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.6f2bj.mongodb.net/bettingdb?retryWrites=true&w=majority&appName=Cluster0

To deploy on Vercel, run:
vercel

for local, run:
vercel dev

for prod:
vercel --prod
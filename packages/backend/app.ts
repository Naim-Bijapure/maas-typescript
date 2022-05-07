import express from "express";
import cors from "cors";

const app = express();
const port = 4000;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let transcactionsData = [];
let TX_DATA_LIMIT = 1000;

app.get("/api/:tx_id", async (req, res) => {
    let { tx_id } = req.params;

    let tx = transcactionsData.filter((data) => data["contractAddress"] === tx_id);
    return res.json({ transcactions: tx });
});

app.post("/api/add", async (req, res) => {
    let { transcactions } = req.body;

    try {
        if (transcactions !== undefined && transcactions.length > 0) {
            let oldTranscactions = transcactionsData;
            // clear the transactions it array increases till 1000 records
            if (oldTranscactions.length >= TX_DATA_LIMIT) {
                try {
                    // await fsWriteAsync("txData.json", JSON.stringify([]), "utf-8");
                    oldTranscactions = [];
                    transcactions = [transcactions[transcactions.length - 1]];
                } catch (error) {}
            }

            let updatedTranscactions = [
                // ...oldTranscactions.filter((data) => data["proposalId"] !== transcactions[0]["proposalId"]),
                ...transcactions,
            ];
            transcactionsData = [...updatedTranscactions];
            console.log("transcactionsData: ", transcactionsData);
            console.log("transcactionsData: length ", transcactionsData.length);
        }
        return res.json({ data: "tx added" });
    } catch (error) {
        console.log("error: ", error);
    }
});

app.listen(port, "0.0.0.0", () => {
    console.log(` application is running on port ${port}.`);
});

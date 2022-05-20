import express from "express";
import cors from "cors";
import moment from "moment";
import http from "http";

import { IContractData } from "./types";

const app = express();
const port: any = Number(process.env.PORT) || 4000;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let transcactionsData = [];
let contractsData: IContractData[] = [];
let TX_DATA_LIMIT = 1000;

app.get("/test", async (req, res) => {
    return res.json({ status: "server is up" });
});

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

// ---------------------
// to list all contract data of a account
// ---------------------
app.get("/api/contractList/:account_id/:chainId", async (req, res) => {
    let { account_id, chainId } = req.params;
    console.log("chainId: ", chainId);

    // let allContracts: IContractData[] = contractsData
    //     .filter((data) => data.owners.includes(account_id)) // account id filter
    //     .filter((data) => data.proposals.filter((proposalData) => proposalData.chainId === Number(chainId))) // chain id filter
    //     .sort((dataA, dataB) => dataB.contractId - dataA.contractId);

    let allContracts = contractsData.map((contractData) => {
        if (contractData.owners.includes(account_id)) {
            if (contractData.proposals.length > 0) {
                // filter the proposals with chaid id
                let filteredProposals = contractData.proposals?.filter(
                    (proposalData) => proposalData.chainId === Number(chainId)
                );
                contractData.proposals = [...filteredProposals];
            }

            return contractData;
        }
    });

    console.log("allContracts: length ", allContracts.length);
    allContracts = [...allContracts.filter((data) => Boolean(data))];
    return res.json({ allContracts });
});

// ---------------------
// To add a contract
// ---------------------

app.post("/api/createContract", async (req, res) => {
    // let { contract_id } = req.params;
    let { walletName, chainIds, account, contractAddress, contractId, owners, signaturesRequired, contractFundAmt } =
        req.body;

    // if (contractsData[account] === undefined) {
    //     contractsData[account] = [];
    // }
    let createdContract = {
        walletName,
        chainIds,
        contractAddress,
        contractId,
        account,
        owners,
        signaturesRequired,
        contractFundAmt,
        proposals: [],
        createdAt: moment().format("DD-MM-YY HH:MM:ss"),
    };
    contractsData.push({ ...createdContract });

    return res.json({ createdContract });
});

// ---------------------
// To  get a specific contract
// ---------------------
app.get("/api/contract/:contractId", async (req, res) => {
    let { contractId } = req.params;

    let contractData = contractsData.find((contractData) => contractData.contractId === Number(contractId));

    console.log("contractData: ", contractData);

    return res.json({ contractData });
});

// ---------------------
// To  add a proposal
// ---------------------
app.post("/api/proposalAdd", async (req, res) => {
    let { contractId, proposalData } = req.body;

    // let contractData = contractsData.find((contractData) => contractData.contractId === Number(contractId));
    let updatedContractData = contractsData.map((data) => {
        if (data.contractId === contractId) {
            data.proposals.push({ ...proposalData, createdAt: moment().format("DD-MM-YY HH:MM:ss") });
            // createdAt: moment().format("DD-MM-YY HH:MM:ss")
        }
        return data;
    });

    console.log("proposal added for this contractId => ", contractId);
    contractsData = [...updatedContractData];

    return res.json({ updatedContractData });
});

// ---------------------
// To  add proposal sign
// ---------------------
app.post("/api/proposal/signAdd", async (req, res) => {
    let { contractId, proposalId, sign, owner, discardSign } = req.body;

    let updatedContractData = contractsData.map((data) => {
        if (data.contractId === contractId) {
            let updatedProposals = data.proposals.map((data) => {
                if (data.proposalId === proposalId) {
                    data.signatures.push({ sign, owner });
                    data.discardSignatures.push({ sign: discardSign, owner });
                }
                return data;
            });
            data.proposals = [...updatedProposals];
        }
        return data;
    });

    console.log("signature added for this contractId and proposal id => ", contractId, proposalId);
    contractsData = [...updatedContractData];

    return res.json({ contractsData });
});

// ---------------------
// update executed transcaction
// ---------------------
app.post("/api/proposal/execute", async (req, res) => {
    let { contractId, proposalId, isDiscard, finalSignaturesCount, finalOwnerList } = req.body;

    let updatedContractData = contractsData.map((data) => {
        if (data.contractId === contractId) {
            data.owners = [...finalOwnerList];
            data.signaturesRequired = finalSignaturesCount;
            let updatedProposals = data.proposals.map((data) => {
                if (data.proposalId === proposalId) {
                    data.isExecuted = true;
                    data.isDiscarded = isDiscard;
                }
                return data;
            });
            data.proposals = [...updatedProposals];
        }
        return data;
    });

    console.log("signature added for this contractId and proposal id => ", contractId, proposalId);
    contractsData = [...updatedContractData];

    return res.json({ contractsData });
});

app.listen(port, "0.0.0.0", () => {
    console.log(` application is running on port ${port}.`);
});

// // to keep alive heroku call test api every 5 minutes
setInterval(function () {
    const https = require("https");

    const options = {
        hostname: "maas-backend.herokuapp.com",
        path: "/test",
        method: "GET",
    };
    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on("data", (d) => {
            process.stdout.write(d);
        });
    });
    req.on("error", (error) => {
        console.error(error);
    });

    req.end();
}, 300000); // every 5 minutes (300000)

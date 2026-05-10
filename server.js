import { exec } from "child_process";
import express from "express";

const app = express();

app.get("/run-automation", (req, res) => {
    exec("bash ./automation/deploy.sh", (error, stdout, stderr) => {
        if (error) {
            return res.send("Error: " + error.message);
        }
        if (stderr) {
            return res.send("Stderr: " + stderr);
        }
        res.send(stdout);
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));

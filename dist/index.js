import * as core from "@actions/core";
import * as github from "@actions/github";
import fetch from "node-fetch";
import { CONSTELLATION_HOST } from "./consts.js";
async function run() {
    try {
        // User-provided inputs
        const service = core.getInput("service", { required: true });
        const environment = core.getInput("environment", { required: true });
        // Secrets / env
        const apiKey = process.env.CONSTELLATION_API_KEY;
        if (!apiKey) {
            throw new Error("Missing CONSTELLATION_API_KEY secret");
        }
        const apiUrl = CONSTELLATION_HOST;
        // GitHub context
        const ctx = github.context;
        const payload = {
            service,
            environment,
            type: "DEPLOYMENT",
            status: "SUCCESS",
            source: "github-actions",
            timestamp: new Date().toISOString(),
            metadata: {
                repo: ctx.repo.repo,
                owner: ctx.repo.owner,
                commit: ctx.sha,
                ref: ctx.ref,
                workflow: ctx.workflow,
                runId: ctx.runId,
                actor: ctx.actor
            }
        };
        core.info(`Sending deployment event for ${service} (${environment})`);
        const response = await fetch(`${apiUrl}/api/v1/events`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const body = await response.text();
            throw new Error(`Constellation API failed (${response.status}): ${body}`);
        }
        core.info("Deployment event sent successfully");
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();

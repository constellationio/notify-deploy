import * as core from "@actions/core";
import * as github from "@actions/github";
import fetch from "node-fetch";
import { CONSTELLATION_HOST } from "./consts.js";

async function run() {
    try {
        // ── Inputs ────────────────────────────────────────────────────────────
        // `service` is the logical service NAME as registered in Constellation
        // (e.g. "payments"). Combined with `environment` and the project the API
        // key belongs to, it uniquely identifies a service.
        const service = core.getInput("service", { required: true });
        const environment = core.getInput("environment", { required: true });

        // Optional: deployment outcome. Defaults to "success"; pass
        // ${{ job.status }} with `if: always()` to report failures too.
        const status = (core.getInput("status") || "success").toUpperCase();

        // Optional: override the Constellation base URL (self-hosted installs).
        const apiUrl = core.getInput("api-url") || CONSTELLATION_HOST;

        // ── Credential ────────────────────────────────────────────────────────
        // The project's API key (cstl_live_sk_...). Authenticates the webhook and
        // scopes the deployment to that project.
        const apiKey = process.env.CONSTELLATION_API_KEY;
        if (!apiKey) {
            throw new Error("Missing CONSTELLATION_API_KEY secret");
        }

        // ── GitHub context ────────────────────────────────────────────────────
        const ctx = github.context;

        const payload = {
            service,
            environment,
            status,
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

        core.info(`Sending deployment event for ${service} (${environment}) — status ${status}`);

        const response = await fetch(`${apiUrl}/api/v1/webhooks/github`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const body = await response.text();
            throw new Error(
                `Constellation API failed (${response.status}): ${body}`
            );
        }

        core.info("Deployment event sent successfully");
    } catch (error: any) {
        core.setFailed(error.message);
    }
}

run();

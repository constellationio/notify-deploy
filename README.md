# 🚀 Constellation Notify Deploy

A GitHub Action to **notify Constellation** whenever a service is deployed — giving teams **real-time deployment visibility** across environments with almost zero setup.

Built for modern engineering teams that want:
- 🔍 Clear deployment timelines  
- 🧭 Service → environment traceability  
- ⚡ Minimal CI/CD configuration  

---

## ✨ What This Action Does

This action sends a **deployment event** to your Constellation API whenever it runs.

Each event includes:
- Service name
- Environment (prod / staging / etc.)
- GitHub repository & commit
- Workflow run metadata
- Deployment timestamp

You only specify **service** and **environment**.  
Everything else is auto-detected from GitHub Actions.

---

## 📦 Use Cases

- Track **who deployed what, where, and when**
- Power internal deployment dashboards
- Correlate incidents with recent releases
- Maintain a single source of truth for deployments

---

## 🔧 Inputs

| Name | Required | Description |
|-----|--------|-------------|
| `api-key` | ✅ Yes | Constellation API key (use GitHub Secrets) |
| `service` | ✅ Yes | Logical service name (e.g. `payments`, `auth-api`) |
| `environment` | ✅ Yes | Deployment environment (e.g. `production`, `staging`) |
| `api-url` | ❌ No | Constellation API base URL (defaults to hosted API) |

---

## 🔐 Secrets Setup

1. Go to **Repository → Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add:
   Name: CONSTELLATION_API_KEY
   Value: <your-api-key>


---

## 🚀 Basic Usage

### Minimal Example

```yaml
name: Deploy Service

on:
push:
 branches:
   - main

jobs:
deploy:
 runs-on: ubuntu-latest
 steps:
   - uses: actions/checkout@v4

   - name: Deploy application
     run: echo "Deploying service..."

   - name: Notify Constellation
     uses: constellationio/notify-deploy@v1
     with:
       api-key: ${{ secrets.CONSTELLATION_API_KEY }}
       service: payments
       environment: production


That’s it 🎉
**Your deployment is now visible in Constellation**

🌍 Multi-Environment Example
- name: Notify Constellation
  uses: constellationio/notify-deploy@v1
  with:
    api-key: ${{ secrets.CONSTELLATION_API_KEY }}
    service: user-service
    environment: staging


🧠 How It Works

The action automatically collects:

Repository name

Commit SHA

Branch

Workflow run ID

Actor (who triggered the workflow)

This metadata is sent to the Constellation Deploy API along with the service and environment you provide.

No SDKs. No config files. No code changes.

❌ Failure Behavior

Missing required inputs → ❌ Action fails

API unreachable → ❌ Action fails

Clear error logs are printed to GitHub Actions output

This ensures deployment visibility is never silently skipped.

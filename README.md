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
| `service` | ✅ Yes | Logical service **name** as registered in Constellation (e.g. `payments`, `auth-api`) |
| `environment` | ✅ Yes | Deployment environment (e.g. `production`, `staging`) |
| `status` | ❌ No | Deployment outcome. Defaults to `success`; pass `${{ job.status }}` with `if: always()` to report failures too |
| `api-url` | ❌ No | Constellation API base URL (defaults to hosted API) |

> **Authentication is via an environment variable, not an input.** Set
> `CONSTELLATION_API_KEY` to your **project's** API key (`cstl_live_sk_…`, found
> under *Settings → Project API Keys*). The key identifies the project, and the
> service is resolved by `service` + `environment` within it.

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
     if: always()
     uses: constellationio/notify-deploy@v3
     with:
       service: payments
       environment: production
       status: ${{ job.status }}
     env:
       CONSTELLATION_API_KEY: ${{ secrets.CONSTELLATION_API_KEY }}
```

### That’s it 🎉
**Your deployment is now visible in Constellation**

## 🌍 Multi-Environment Example
```yaml
- name: Notify Constellation
  uses: constellationio/notify-deploy@v3
  with:
    service: user-service
    environment: staging
  env:
    CONSTELLATION_API_KEY: ${{ secrets.CONSTELLATION_API_KEY }}
```

## 🧠 How It Works
The action automatically collects:

- Repository name
- Commit SHA
- Branch
- Workflow run ID
- Actor (who triggered the workflow)

This metadata is sent to the Constellation Deploy API along with the service and environment you provide.

### No SDKs. No config files. No code changes.

## ❌ Failure Behavior

- Missing required inputs → ❌ Action fails

- API unreachable → ❌ Action fails

- Clear error logs are printed to GitHub Actions output

- This ensures deployment visibility is never silently skipped.

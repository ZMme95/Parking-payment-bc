# CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions to automate testing, validation, and deployment to Railway.app.

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)
**Triggers:** Push to `main` or `develop` branches, Pull Requests

**Jobs:**
- **Lint & Code Quality**: Checks for syntax errors and code quality
- **Security Audit**: Runs npm audit to check for vulnerabilities
- **Build Verification**: Verifies the application can be built
- **Deploy to Railway**: Automatically deploys to production (only on `main` branch)
- **Notifications**: Sends status updates

**Flow:**
```
Lint → Security → Build → Deploy → Notify
```

### 2. Pull Request Checks (`pr-checks.yml`)
**Triggers:** Pull Requests to `main` branch

**Checks:**
- Syntax validation
- File existence verification
- Security audit
- Automatic PR comments with results

### 3. Health Check (`health-check.yml`)
**Triggers:** Every 6 hours (scheduled) or manual trigger

**Checks:**
- Application file structure
- Dependency integrity
- Syntax validation
- Generates health report

## Environment Variables

Required secrets in GitHub:
- `RAILWAY_TOKEN`: Your Railway API token

Set in GitHub repository settings:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add `RAILWAY_TOKEN` with your Railway API token

## Deployment Process

### Automatic Deployment (main branch)
```
1. Push code to main branch
2. GitHub Actions triggers CI/CD pipeline
3. Lint & Security checks run
4. Build verification passes
5. Automatic deployment to Railway
6. Live application updated
```

### Manual Deployment
```
1. Create a pull request
2. PR checks validate changes
3. Merge PR to main
4. Automatic deployment triggers
```

## Monitoring

### View Workflow Status
1. Go to your GitHub repository
2. Click **Actions** tab
3. See all workflow runs and their status

### View Logs
1. Click on a workflow run
2. Click on a job to see detailed logs
3. Scroll to see error messages or warnings

## Troubleshooting

### Deployment Failed
1. Check the workflow logs in GitHub Actions
2. Look for error messages in the "Deploy to Railway" step
3. Verify Railway token is correct in GitHub secrets
4. Check Railway dashboard for service status

### Build Verification Failed
1. Run `npm install` locally to verify dependencies
2. Run `node -c server.js` to check syntax
3. Verify all required files exist

### Security Audit Warnings
1. Check npm audit output in workflow logs
2. Update vulnerable packages: `npm update`
3. Commit and push changes

## Best Practices

1. **Always create PRs** for changes to `main` branch
2. **Review PR checks** before merging
3. **Monitor workflow runs** after pushing to main
4. **Keep dependencies updated** regularly
5. **Test locally** before pushing

## Disabling Workflows

To temporarily disable a workflow:
1. Go to **Actions** tab
2. Click workflow name
3. Click **...** menu
4. Select **Disable workflow**

To re-enable:
1. Click workflow name
2. Click **Enable workflow**

## Adding New Workflows

1. Create new `.yml` file in `.github/workflows/`
2. Define triggers and jobs
3. Commit and push
4. Workflow automatically appears in Actions tab

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway Deployment Action](https://github.com/railwayapp/deploy-action)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

1. First apply the OpenTofu changes to create the service accounts:
   ```bash
   cd backend/api
   tofu init
   tofu apply
   ```
2. Get the GitHub Actions key:
   ```bash
   tofu output -json github_actions_key | jq -r
   ```
3. Add this key as a GitHub secret named `GCP_SA_KEY` in your repository settings

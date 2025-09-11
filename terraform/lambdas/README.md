# Instructions for Lambda functions

1. Check additional documentation in each function folder for specific steps.
2. Run `npm run build` to build new zip folder in directory after making changes. Might have to `chmod +x build.sh` for permissions.
3. Commit the dist folder and its lambda zip folder.
4. Use `terraform plan -var-file=secrets.tfvars` to carefully review expected changes.
5. `terraform apply -var-file=secrets.tfvars` to push changes.

# Humongous.Healthcare API Service

This codebase is a representative example of a Health Check tracking API service for Humongous Healthcare.

# Running the API Service

To run the API service locally, it is necessary to define the `CosmosDb::Account` and `CosmosDb::Key` settings in the `appsettings.json` file to point to a valid CosmosDb account.

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*",
  "CosmosDb": {
    "Account": "<Replace with your account URL>",   // <-- The CosmosDb Account
    "Key": "<Replace with your account key>",       // <-- The CosmosDb Access Key
    "DatabaseName": "HealthCheckDB",
    "ContainerName": "HealthCheck"
  }
}
```
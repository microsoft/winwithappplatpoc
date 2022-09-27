<h1>Win with App Platform -- Humongous Healthcare Proof of Concept</h1>

<h2>Hands-on lab</h2>

September 2022

**Table of contents**

- [Hands-on Lab Step-by-Step](#hands-on-lab-step-by-step)
  - [Abstract and learning objectives](#abstract-and-learning-objectives)
  - [Overview](#overview)
  - [Solution architecture](#solution-architecture)
  - [Requirements](#requirements)
  - [Before the hands-on lab](#before-the-hands-on-lab)
  - [Exercise 1:  Finish configuring Azure services and retrieve values](#exercise-1--finish-configuring-azure-services-and-retrieve-values)
    - [Task 1: Create Cosmos DB container](#task-1-create-cosmos-db-container)
  - [Exercise 2:  Review and publish the Humongous Healthcare Web API service](#exercise-2--review-and-publish-the-humongous-healthcare-web-api-service)
    - [Task 1:  Review the Humongous Healthcare Web API service](#task-1--review-the-humongous-healthcare-web-api-service)
    - [Task 2: Run the Humongos Healthcare Web API service in a container](#task-2-run-the-humongos-healthcare-web-api-service-in-a-container)
    - [Task 3: Push the Humongous Healthcare Web API container image to ACR](#task-3-push-the-humongous-healthcare-web-api-container-image-to-acr)
    - [Task 4: Deploy the Humongous Healthcare Web API service to AKS](#task-4-deploy-the-humongous-healthcare-web-api-service-to-aks)
  - [TODO review](#todo-review)
  - [Exercise 3:  Configure continuous deployment with GitHub Actions](#exercise-3--configure-continuous-deployment-with-github-actions)
    - [Task 1:  Create and Edit a GitHub Action](#task-1--create-and-edit-a-github-action)
  - [Exercise 4:  Configure API Management](#exercise-4--configure-api-management)
    - [Task 1:  Review the Health Checks API](#task-1--review-the-health-checks-api)
    - [Task 2:  Connect API Management to the App Service](#task-2--connect-api-management-to-the-app-service)
  - [Exercise 5:  Create a Power Apps custom connector and application](#exercise-5--create-a-power-apps-custom-connector-and-application)
    - [Task 1:  Create a custom Power Apps connector](#task-1--create-a-custom-power-apps-connector)
    - [Task 2:  Use the Power Apps custom connector in a new application](#task-2--use-the-power-apps-custom-connector-in-a-new-application)
    - [Task 3: Deploy the Humongous Healthcare Web API service to AKS](#task-3-deploy-the-humongous-healthcare-web-api-service-to-aks)

# Hands-on Lab Step-by-Step

## Abstract and learning objectives

In this hands-on-lab, you will build a proof of concept for an Application Innovation solution, combining several Azure services and technologies together to solve a customer problem.  In this lab, you will deploy a .NET 6 Web API application to Azure Kubernetes Service and perform continuous integration and continuous deployment with GitHub Actions.  Then, you will use the API Management service to "protect" Web API and allow for centralized API versioning and management.  Then, you will deploy a React frontend to App Services and use it to access your API endpoints through API Management.

## Overview

**Humongous Healthcare** is a global network of healthcare providers with presence throughout the industry.  Humongous Healthcare wishes to drive a new Health Checks initiative, which specifically entails building a suite of health check applications for end users.  These applications will allow users to submit information on their current health status and submit a questionnaire concerning any medical symptoms they might have experienced over the past 14 days.

Humongous already uses a variety of Microsoft Azure services, taking advantage of both Infrastructure-as-a-Service and Platform-as-a-Service offerings.  Their software engineers and infrastructure team have a good working familiarity with Azure services and wish to use this opportunity to develop an innovative product which can serve as a guide for future modernization of their existing applications and infrastructure.

The Engineering team at Humongous Healthcare is looking for a modern, innovative application platform, but this is not the only key group which will be involved.  Business Analysts will be responsible for creating the business logic and user experience for most of the Health Checks applications (with the assistance of an outside consulting group).  The consulting group will not be required to deploy to AKS and have indicated that they prefer to work with App Services.  These applications should be able to access API endpoints which the Engineering team plan to build.

Humongous would like to manage one API for accessing the back end of all of these health applications.  In practice, Humongous expects something on the order of 15-20 endpoints to support the breadth of their health check application suite, but for the purposes of a proof of concept, they would like to see two endpoints implemented: one which submits information on current health status and one which retrieves submissions for the registered user.  The key data points Humongous would like to see in this proof of concept are as follows:

- Submission ID, generated by the system
- Patient ID, handled as part of a future authentication process.  For the proof of concept, it would be okay for the end application to hard-code the patient ID
- Date and time of submission
- Current health status (one of "I feel well" or "I feel unwell")
- A list of symptoms over the past 14 days, where each symptom is a free-form text entry with no validation

Humongous's Engineering team also wish to have all data stored in a single database, as this will simplify security and open up opportunities for their data scientists to analyze the data most efficiently.  In addition, they would like to centralize management of any access points to the data.  Different Engineering teams will work on separate API endpoints and they are interested in anything which can improve the coordination between teams.  As far as data storage is concerned, the architects would like to see flexible data structures.  The reason for this is that individual providers in their network often have differing requirements on what data they collect, depending on their specialization.  The questionnaires which end users fill out will likely differ based on facility, mode of treatment, nation, and region.  They may also change over time to support additional testing options, such as asking end users a subset of the questions sometimes or adding and removing questions from the survey applications.

For this proof of concept, Humongous would also like to see a model example of Continuous Integration and Continuous Deployment (CI/CD) pipelines for code development and deployment.

## Solution architecture

The following diagram provides a high-level overview of the Azure services we will use for implementation. **TODO new diagram**

![High-level architecture, as described below.](media/architecture-diagram.png "High-level architecture")

API Management will allow Humongous Healthcare to centralize and manage information on a variety of API endpoints.  These API endpoints may be implemented using a variety of Azure services, but the one which makes the most intuitive sense is Azure Kubernetes Service because the engineering team eventual plans to orchestrate a large number of APIs.

To store and retrieve data, the endpoints will use Cosmos DB for data storage.  This satisfies customer requests for a flexible schema and includes a rich .NET interface.  Furthermore, via Cosmos Link, we can include an automated process to make data available in Azure Synapse Analytics dedicated SQL pools or Spark pools.  This allows Humongous Healthcare data scientists to analyze data across a variety of end users over time without building extensive ELT pipelines or processes.  Because this would be a "phase two" operation, it deserves mention in an architectural diagram but will not be part of the proof of concept.

For this solution, we used GitHub for source control and continuous integration/continuous deployment tasks.  Azure DevOps is another viable alternative.  After checking code in, a GitHub Action will deploy the .NET Web API code to an existing App Service, making changes and deployment straightforward.  This also provides the opportunity to perform unit and integration testing against code before deploying the code, although that is out of scope of the proof of concept.

Azure Front Door is a layer 7 load balancer which includes web application firewall (WAF) capabilities.  This allows Humongous to implement the [Gatekeeper architecture pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/gatekeeper) and secure their APIs against malicious traffic, including IP addresses from known bot networks.  Humongous can use Azure-managed rule sets, as well as creating custom rule sets to monitor, redirect, or block traffic as configured.

> **Note**:  This proof of concept will not include the Azure Front Door or Synapse Analytics services.

## Requirements

1. Microsoft Azure subscription must be pay-as-you-go or MSDN.

    - Trial subscriptions will not work.

2. Install [Visual Studio Code](https://code.visualstudio.com/).

    - Install the [C# for Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp).
    - Install the [Azure App Service for Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice).

3. Install the latest version of [the .NET 6 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0).

4. Install the latest version of the [Postman](https://www.postman.com/) client.

## Before the hands-on lab

Refer to the [Before the hands-on lab setup guide](Before%20the%20Hands-On%20Lab.md) before continuing to the lab exercises.

## Exercise 1:  Finish configuring Azure services and retrieve values

### Task 1: Create Cosmos DB container

1. In the **Overview** section for your Cosmos DB account, select **Add Container**.

    ![In the Overview, Add Container is selected.](media/azure-cosmos-db-add-container.png 'Add Container')

3. In the **New Container** tab, complete the following:

   | Field                              | Value                                           |
   | ---------------------------------- | ----------------------------------------------- |
   | Database id                        | _select `Create new` and enter `HealthCheckDB`_ |
   | Share throughput across containers | _select the checkbox_                           |
   | Throughput                         | _select `Manual`_                               |
   | Number of R/Us                     | _enter `400`_                                   |
   | Container id                       | _`HealthCheck`_                                 |
   | Partition key                      | _`/id`_                                         |

   ![The form fields are completed with the previously described settings.](media/azure-create-cosmos-db-healthcheck-container.png 'Create a container for health checks')

4. Select **OK** to create the container. This will take you to the Data Explorer pane for Cosmos DB.

## Exercise 2:  Review and publish the Humongous Healthcare Web API service

### Task 1:  Review the Humongous Healthcare Web API service

1. Open the hands-on lab in Visual Studio Code and use the terminal to navigate to the `Humongous.Healthcare` project.

2. Run the following commands in the terminal to restore and build the project, bringing in necessary packages.

    ```sh
    dotnet restore
    dotnet build
    ```

3. Review the `HealthCheckController.cs` controller to see the available endpoints.  There are two endpoints included in this controller:  `HealthCheck` and `HealthCheck/GetStatus`.  The `HealthCheck` endpoint accepts four REST API verbs:  `GET`, `PUT`, `POST`, and `DELETE`.  Furthermore, data retrieval using `GET` will either list health checks (when passing in zero parameters) or retrieve details on a single health check (passing in one parameter).  For this proof of concept, we do not implement logic to control results by patient ID but the code base could be extended to incorporate this.  The `GetStatus` method serves as a quick test method, ensuring that the service is up by returning data.

4. Review the `Startup.cs` file, particularly the `ConfigureServices()` and `Configure()` methods.  Because this project uses the `Swashbuckle.AspNetCore` NuGet package, we can build a Swagger API and user interface automatically from our Web API definition.  This will be important later on when integrating with API Management.

5. Open the `appsettings.json` file and replace the `Account` and `Key` with your Cosmos DB URI and primary key, respectively.

6. Try this project locally and ensure that it works as expected.  To do this, execute the following in the terminal:

    ```sh
    dotnet run
    ```

    ![Debugging the health checks Web API application.](media/health-checks-debug-locally.png 'Debug Web API')

7. Use the Postman application to call the `HealthCheck/GetStatus` endpoint.  This should return one record.

    ![Testing the health checks application locally.](media/health-checks-debug-getstatus.png 'Execute the GetStatus endpoint')

8. Use the Postman application to post three status updates, one call at a time.  Use the following JSON blocks to execute `POST` operations against the `HealthCheck` endpoint.  Be sure to set the Body format to JSON.  You should get back a **201 Created** response with a copy of each created record.

    ```json
    {
        "patientid": 5,
        "date": "2021-09-01T00:41:49.9602636+00:00",
        "healthstatus": "I feel healthy",
        "symptoms": [
            "None"
        ]
    }
    ```

    ```json
    {
        "patientid": 5,
        "date": "2021-09-04T00:41:49.9602636+00:00",
        "healthstatus": "I feel unwell",
        "symptoms": [
            "Hair loss",
            "Internal bleeding",
            "Temporary blindness"
        ]
    }
    ```

    ```json
    {
        "patientid": 5,
        "date": "2021-09-08T00:41:49.9602636+00:00",
        "healthstatus": "I feel healthy",
        "symptoms": [
            "Hair regrowth",
            "Ennui"
        ]
    }
    ```

    ![Adding health checks records through Postman.](media/health-checks-add-records.png 'Add records')

9. Use the `GET` verb on the `HealthCheck` endpoint to retrieve an array containing health check records.

    ![Retrieving health checks records through Postman.](media/health-checks-get-records.png 'Get records')

10. When you are done, use `Ctrl+C` to stop the dotnet service.

### Task 2: Run the Humongos Healthcare Web API service in a container

1. Open the hands-on lab in Visual Studio Code and use the terminal to navigate to the `Humongous.Healthcare` project.

2. Create a file named `Dockerfile` and add the following contents.

    ```dockerfile
    FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
    WORKDIR /app

    # Copy project file
    COPY ./Humongous.Healthcare.csproj .
    # Restore as distinct layer
    RUN dotnet restore

    # Copy everything else
    COPY . .

    # Build and publish a release
    RUN dotnet publish -c Release -o out

    # Build runtime image
    FROM mcr.microsoft.com/dotnet/aspnet:6.0
    WORKDIR /app
    COPY --from=build-env /app/out .
    ENTRYPOINT ["dotnet", "Humongous.Healthcare.dll"]
    ```

    This is a multi-stage Dockerfile with 2 stages, build and runtime.  The build stage uses the .net 6 SDK image which contains all the compilers and tooling needed to create the Web API service. In contrast, the runtime stage is based on the smaller `aspnet` image, which only contains the necesssary binaries to execute asp.net applications.

    The build stage:
    - Copies the project file into the Docker container and runs `dotnet restore` to retrieve nuget packages.  This is a stand-alone layer so that the packages will be cached if we need to run `docker build` again.
    - Copies the remaining project files to the container then runs `dotnet publish` to create the Web API service.

    The runtime stage starts from a clean `aspnet` image without compiler tooling or intermediate object files then:
    - Copies the Web API binaries from the build stage.
    - Configures the container image to run the Web API on startup.

3. Run the following command to build the container image.

    ```sh
    docker build -t api .
    ```

4. Run the following command to run an instance of the container image.

    ```sh
    docker run -it -p 5000:80 api
    ```

5. Use postman (or your browser) to `GET` the following URL and confirm the Web API is functioning inside the container.

    `http://localhost:5000/HealthCheck`

6. When you are done, use `Ctrl+C` to stop the container instance.

### Task 3: Push the Humongous Healthcare Web API container image to ACR

1. Use the following command to tag your container image with your ACR login server name and a more descriptive repository name:

    ```sh
    docker tag api <replace with your login server>/humongous-healthcare-api:0.0.0
    ```

    Example:

    ```sh
    docker tag api taw.azurecr.io/humongous-healthcare-api:0.0.0
    ```

2. Login to the Azure CLI and the ACR instance using the following commands:

    ```sh
    az login
    az acr login --name <acrName>
    ```

    Example
    ```sh
    az login
    az acr login --name taw
    ```

3. Use the following command to push the container image to ACR.

    ```sh
    docker push <replace with your login server>/humongous-healthcare-api:0.0.0
    ```

    Example:

    ```sh
    docker push taw.azurecr.io/humongous-healthcare-api:0.0.0
    ```

### Task 4: Deploy the Humongous Healthcare Web API service to AKS

1. Open the hands-on lab in Visual Studio Code and use the terminal to navigate to the `Humongous.Healthcare` project.

2. Create a folder named `manifests` and add a file named `deployment.yml` with the following content:
## TODO review
    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
    name: "humongous-healthcare-api"
    spec:
    replicas: 3
    selector:
        matchLabels:
        app: "humongous-healthcare-api"
    template:
        metadata:
        labels:
            app: "humongous-healthcare-api"
        spec:
        containers:
            - name: "humongous-healthcare-api"
            image: "taw4acrjrc23a.azurecr.io/humongous-healthcare-api:0.0.0"
            env:
                - name: CosmosDb__Account
                valueFrom:
                    secretKeyRef:
                    name: cosmosdb
                    key: cosmosdb-account
                    optional: false
                - name: CosmosDb__Key
                valueFrom:
                    secretKeyRef:
                    name: cosmosdb
                    key: cosmosdb-key
                    optional: false
                - name: CosmosDb__DatabaseName
                value: HealthCheckDB
                - name: CosmosDb__ContainerName
                value: HealthCheck
            imagePullPolicy: IfNotPresent
            ports:
                - name: http
                containerPort: 80
                protocol: TCP
            livenessProbe:
                httpGet:
                path: /HealthCheck
                port: http
            readinessProbe:
                httpGet:
                path: /HealthCheck
                port: http
            resources:
                limits:
                cpu: 200m
                memory: 256Mi
                requests:
                cpu: 200m
                memory: 256Mi
    ```

3. Open the Azure extension for Visual Studio Code.  Navigate to the **App Service** menu and select your App Service account.  Then, select the **Deploy to Web App...** option.

    ![Select the App Service.](media/vscode-app-service.png 'App Service')

4. Select **Browse** from the list of folders to deploy.

    ![Select the Browse option.](media/vscode-app-service-1.png 'Browse for a folder')

5. Choose the **Humongous.Healthcare** folder.

    ![Select the Humongous.Healthcare folder.](media/vscode-app-service-2.png 'Choose a folder')

6. Choose the subscription hosting the App Service in the next step, and then select the App Service itself in the following step.

    ![Select the App Service.](media/vscode-app-service-3.png 'Choose an App Service')

7. Select **Deploy** from the next menu to push the service.

    ![Deploy the App Service.](media/vscode-app-service-4.png 'Deploy the App Service')

8. Navigate to the **Configuration** option in the **Settings** menu for your App Service and select **+ New application setting**.  Enter the following application settings:

    | Name                    | Value                                              |
    | ----------------------- | -------------------------------------------------- |
    | CosmosDb__Account       | _enter the URL of your Cosmos DB account_          |
    | CosmosDb__Key           | _enter the primary key for your Cosmos DB account_ |
    | CosmosDb__DatabaseName  | _enter `HealthCheckDB`_                            |
    | CosmosDb__ContainerName | _enter `HealthCheck`_                              |

    Select **Save** to save these application settings.

    ![Application settings for the App Service.](media/app-service-app-settings.png 'Application settings')

> **Note:** If you get 404 errors when trying to access your App Service at this point, don't panic!  The purpose of this task was to link your existing code with an App Service.  In the next task, you will configure a CI/CD process to perform this deployment automatically upon check-in.  If you do see 404 errors, the following exercise will correct them.

## Exercise 3:  Configure continuous deployment with GitHub Actions

### Task 1:  Create and Edit a GitHub Action

1. Navigate to the **Deployment Center** option in the **Deployment** menu for your App Service.  From the **Source** drop-down list, select **GitHub**.  Note that you may need to authenticate with GitHub and provide specific access permissions for your account.

    ![Select GitHub for Continuous Deployment (CI/CD).](media/cicd-source.png 'Select code source')

2. Choose your the organization, repository, and primary branch for this lab.  Then, select **Save** to create a YAML file containing a GitHub Action in the `.github\workflows` folder of your repository.

    ![Create a GitHub Action to deploy on code check-in.](media/cicd-create-action.png 'Create a Github Action')

3. Navigate to your GitHub repository via the GitHub website and select the **.github/workflows** folder which now appears.

    ![Open the workflows folder.](media/cicd-workflows.png 'Open the workflows folder')

4. Inside the folder, there should be one YAML file.  Open that file and then select the **Edit** option to modify this file.  We will need to make a change to build and deploy just the **Humongous.Healthcare** folder within our entire repository.

    ![Edit the GitHub Action.](media/cicd-edit.png 'Edit file')

5. Add the following below the line `runs-on: windows-latest` in your YAML file.  Then, select **Start commit** and **Commit** to save your changes.

    ```yaml
    defaults:
      run:
        working-directory: ./Humongous.Healthcare/
    ```

6. After committing your changes, the GitHub Action should run automatically and succeed.  Select the **Actions** menu option to review workflow outcomes.  There will be one prior failure, which happened when App Services set up the initial GitHub Action pointing to the root folder.

    ![Review workflow results on the Actions page.](media/cicd-actions.png 'All workflows')

7. Once this deployment succeeds, you should be able to navigate to your App Service URL in Postman and perform the same `GET`, `POST`, `PUT`, and `DELETE` operations you could locally.

## Exercise 4:  Configure API Management

### Task 1:  Review the Health Checks API

Because this project uses the `Swashbuckle.AspNetCore` NuGet package, we can build a Swagger API and user interface automatically from our Web API definition.  The `ConfigureServices()` method in **Startup.cs** automatically configures a [Swagger OpenAPI interface](https://swagger.io/specification/).

1. Navigate to https://{appsvc}.azurewebsites.net/swagger/v1/swagger.json, replacing `{appsvc}` with the name of your App Service URL.  This will take you to a JSON schema describing the Health Check API.

    ![Review the Swagger-generated JSON describing this API.](media/swagger-json.png 'API description in JSON format')

2. Navigate to https://{appsvc}.azurewebsites.net/swagger/index.html, again replacing `{appsvc}` with the name of your App Service URL.  This will take you to an auto-generated user interface describing each of the API endpoints.

    ![Review the Swagger UI showing API endpoints and available verbs.](media/swagger-ui.png 'Swagger UI')

### Task 2:  Connect API Management to the App Service

1. Open the API Management service in your `taw-win-with-app-platform` resource group.  Navigate to the **APIs** option in the **APIs** menu, choose **+ Add API**, and select **OpenAPI** in the **Create from definition** section.

    > **Note:**  There is an option in the **Define a new API** menu for defining an App Service API, and there is a way to connect an App Service directly to API Management, but these two methods will require manual editing of the Swagger file to work.  This method will automatically pick up all available endpoints without adding spurious `TRACE` or `HEAD` verbs.

    ![Define a new OpenAPI-based API.](media/apim-openapi.png 'OpenAPI')

2. Create a new API from an OpenAPI specification by entering the following details.  Then select **Create** to generate a new API.

    | Parameter             | Value                      |
    | --------------------- | -------------------------- |
    | OpenAPI specification | Enter the swagger.json URL |
    | Display name          | Enter `HealthChecks`       |
    | Name                  | Enter `healthchecks`       |
    | API URL suffix        | Leave blank                |

    ![Create a new API from an OpenAPI specification.](media/apim-create.png 'Create from OpenAPI specification')

3. After creating this API, you should now see the same endpoints that you observed in Task 1.  Select the **Settings** menu option to continue to the next step.

    ![The Health Check endpoints are now available in API Management.](media/apim-endpoints.png 'API Management endpoints')

4. In the **Web service URL** settings entry, enter the base URL for your App Service.  Then, select **Save**.

    ![Update the web service URL to point to your App Service.](media/apim-web-service-url.png 'Web service URL')

5. Select the **Test** menu and then choose the first `GET` method for health checks.  Select **Send** to perform a test.  You should receive back a response with "200 OK" indicating that the request was successful.

    ![Test API Management.](media/apim-test.png 'Perform a test')

    > **Note:**  If you receive a 500 error, make sure that you configured the web service URL in the prior step.

6. Humongous Healthcare would like to perform rate limiting as a method of limiting risk of Denial of Service attacks.  In order to enable rate limiting on an API, return to the **Design** menu and ensure that you have selected **HealthChecks** and **All operations**.  From there, select **+ Add policy** under **Inbound processing**.

    ![Add a new inbound processing policy.](media/apim-new-policy.png 'Add policy')

7. On the inbound policy list, select the **Limit call rate** policy.

    ![Select the Limit call rate policy.](media/apim-select-policy.png 'Select policy')

8. Humongous would like to ensure that a particular user does not send more than 10 calls over a 300-second period.  Enter those values into the appropriate fields and select **Save** to create this policy.

    ![Limit inbound calls to no more than 10 per 300 seconds per user.](media/apim-create-policy.png 'Create policy')

    > **Note:** If you are using the Consumption SKU of API Management, you will not be able to save this policy.  In that case, select **Discard** to cancel this operation.  You might also need to delete a **rate-limit-key** policy below the **base** policy in your **Inbound processing** section.  To do this, select the **...** menu and choose **Delete** to remove it.

## Exercise 5:  Create a Power Apps custom connector and application

For this final exercise, you will need a Power Apps subscription.  This may be a paid subscription or a free Power Apps developer plan.

### Task 1:  Create a custom Power Apps connector

1. In your API Management service, navigate to the **Power Platform** menu option in the **APIs** menu.  Then, select **Create a connector**.

    ![Create a custom connector from API Management to Power Apps.](media/apim-create-connector.png 'Create a connector')

2. Choose **HealthChecks** from the API drop-down list and then select the PowerApps environment you wish to deploy to.  Keep the API display name as `HealthChecks` and select **Create**.  Note that this operation may take 1-2 minutes to complete.

    ![Select the HealthChecks API and publish to an existing Power Apps environment.](media/apim-create-connector-1.png 'Create a connector')

3. By default, API Management requires callers to pass in a subscription key, and this is what we use for rate limiting.  To allow for testing in Power Apps, we will add a new subscription key.  To do this, navigate to the **Subscriptions** option on the **APIs** menu and then select **+ Add subscription**.

    ![Add a new subscription key for API Management.](media/apim-add-subscription.png 'Add a subscription key')

4. Enter `power-apps-testing` for the Name and `Power Apps Testing` for the Display Name.  Then, choose **API** from the Scope menu and in the APIs drop-down menu, choose **HealthChecks**.  This will limit the key to one API.  Select **Create** to complete this process.

    ![Create a new subscription key for API Management.](media/apim-new-subscription.png 'Add a new subscription')

5. To view the key, select the **...** menu for the newly-created subscription and select **Show/hide keys**.  Copy the primary key for use later.

    ![Show the keys for a particular subscription.](media/apim-show-keys.png 'Show/hide keys')

### Task 2:  Use the Power Apps custom connector in a new application

1. Navigate to [the Power Apps website](https://make.powerapps.com/).  In the **Dataverse** menu, select **Custom Connectors**.  You should see the **HealthChecks** connector.  Choose the **Edit** option to review this connector.

    ![Select the HealthChecks custom connector.](media/pa-custom-connectors.png 'Custom connectors')

2. Navigate to the **5. Test** page and select **+ New connection** to create a new connection for this custom connector.

    ![Create a new connection.](media/pa-new-connection.png 'New connection')

3. Enter your subscription key and select **Create** to save this connection.  This will take you to the **Connections** menu setting, so return to where you were.

    ![Provide a valid subscription key.](media/pa-new-connection-1.png 'Create a new connection')

4. Using the newly-created connection, choose the **get-healthcheck** operation and select **Test operation**.  Doing so, you should get back a 200 response code and see the health checks you have created.  You may also test the other methods if you wish.  Once you have finished, select **Close** to close the custom connector panel.

    ![Test the get-healthcheck operation.](media/pa-test-operation.png 'Test operation')

5. On the **Home** menu, select **Canvas app from blank** to create a new canvas app.

    ![Create a new canvas app.](media/pa-new-canvas-app.png 'Canvas app from blank')

6. Name the app **Health Checks** and set the format to **Phone**.  Then, select **Create**.

    ![Name the application and set the format to fit on a phone.](media/pa-new-canvas-app-1.png 'Create an app')

7. On the Power Apps canvas, select the **Data** menu and then choose **+ Add data**.  In the dropdown, expand the **Connectors** menu and choose the **HealthChecks** custom connector.  You will then be asked to choose a connection; choose the **HealthChecks** connection you created in this task.

    ![Add the HealthChecks custom connector to a Power App.](media/pa-add-custom-connector.png 'HealthChecks connector')

At this point, you can reference the **HealthChecks** connector and methods such as `HealthChecks.gethealthcheck()` to populate canvas elements.  Using the available API endpoints, you can create a mobile application which allows for entering new health check data, reviewing old health checks, and listing symptoms on a details page.

![An example health check application built using Power Apps.](media/health-checks-app.png 'The Health Checks app')


### Task 3: Deploy the Humongous Healthcare Web API service to AKS

1. Open the Azure extension for Visual Studio Code.  Navigate to the **App Service** menu and select your App Service account.  Then, select the **Deploy to Web App...** option.

    ![Select the App Service.](media/vscode-app-service.png 'App Service')

2. Select **Browse** from the list of folders to deploy.

    ![Select the Browse option.](media/vscode-app-service-1.png 'Browse for a folder')

3. Choose the **Humongous.Healthcare** folder.

    ![Select the Humongous.Healthcare folder.](media/vscode-app-service-2.png 'Choose a folder')

4. Choose the subscription hosting the App Service in the next step, and then select the App Service itself in the following step.

    ![Select the App Service.](media/vscode-app-service-3.png 'Choose an App Service')

5. Select **Deploy** from the next menu to push the service.

    ![Deploy the App Service.](media/vscode-app-service-4.png 'Deploy the App Service')

6. Navigate to the **Configuration** option in the **Settings** menu for your App Service and select **+ New application setting**.  Enter the following application settings:

    | Name                    | Value                                              |
    | ----------------------- | -------------------------------------------------- |
    | CosmosDb__Account       | _enter the URL of your Cosmos DB account_          |
    | CosmosDb__Key           | _enter the primary key for your Cosmos DB account_ |
    | CosmosDb__DatabaseName  | _enter `HealthCheckDB`_                            |
    | CosmosDb__ContainerName | _enter `HealthCheck`_                              |

    Select **Save** to save these application settings.

    ![Application settings for the App Service.](media/app-service-app-settings.png 'Application settings')

> **Note:** If you get 404 errors when trying to access your App Service at this point, don't panic!  The purpose of this task was to link your existing code with an App Service.  In the next task, you will configure a CI/CD process to perform this deployment automatically upon check-in.  If you do see 404 errors, the following exercise will correct them.

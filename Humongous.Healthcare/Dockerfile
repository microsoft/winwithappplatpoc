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
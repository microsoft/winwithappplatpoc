using Humongous.Healthcare.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Fluent;
using Microsoft.Extensions.Configuration;

namespace Humongous.Healthcare.Services
{
    public class CosmosDbService : ICosmosDbService
    {
        private Container _container;
        public CosmosDbService(
            CosmosClient cosmosDbClient,
            string databaseName,
            string containerName)
        {
            _container = cosmosDbClient.GetContainer(databaseName, containerName);
        }
        public async Task AddAsync(HealthCheck item)
        {
            await _container.CreateItemAsync(item, new PartitionKey(item.id));
        }
        public async Task DeleteAsync(string id)
        {
            await _container.DeleteItemAsync<HealthCheck>(id, new PartitionKey(id));
        }
        public async Task<HealthCheck> GetAsync(string id)
        {
            try
            {
                var response = await _container.ReadItemAsync<HealthCheck>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (CosmosException) //For handling item not found and other exceptions
            {
                return null;
            }
        }
        public async Task<IEnumerable<HealthCheck>> GetMultipleAsync(string queryString)
        {
            var query = _container.GetItemQueryIterator<HealthCheck>(new QueryDefinition(queryString));
            var results = new List<HealthCheck>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.ToList());
            }
            return results;
        }
        public async Task UpdateAsync(string id, HealthCheck item)
        {
            await _container.UpsertItemAsync(item, new PartitionKey(id));
        }
    }
}

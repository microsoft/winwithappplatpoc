using Humongous.Healthcare.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Humongous.Healthcare.Services
{
    public interface ICosmosDbService
    {
        Task<IEnumerable<HealthCheck>> GetMultipleAsync(string query);
        Task<HealthCheck> GetAsync(string id);
        Task AddAsync(HealthCheck item);
        Task UpdateAsync(string id, HealthCheck item);
        Task DeleteAsync(string id);
    }
}

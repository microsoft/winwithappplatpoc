using Humongous.Healthcare.Models;
using Humongous.Healthcare.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Humongous.Healthcare.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class HealthCheckController : ControllerBase
    {
        private readonly ICosmosDbService _cosmosDbService;
        public HealthCheckController(ICosmosDbService cosmosDbService)
        {
            _cosmosDbService = cosmosDbService ?? throw new ArgumentNullException(nameof(cosmosDbService));
        }


        // GET /HealthCheck
        [HttpGet]
        [ProducesResponseType(typeof(List<HealthCheck>), 200)]
        public async Task<IActionResult> List()
        {
            return Ok(await _cosmosDbService.GetMultipleAsync("SELECT * FROM c"));
        }

        // GET /HealthCheck/23dbf68d-3f40-41de-ae1b-8e3558cd17f9
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(List<HealthCheck>), 200)]
        public async Task<IActionResult> Get(string id)
        {
            return Ok(await _cosmosDbService.GetAsync(id));
        }

        // POST /HealthCheck
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HealthCheck item)
        {
            item.id = Guid.NewGuid().ToString();
            await _cosmosDbService.AddAsync(item);
            return CreatedAtAction(nameof(Get), new { id = item.id }, item);
        }

        // PUT /HealthCheck/23dbf68d-3f40-41de-ae1b-8e3558cd17f9
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit([FromBody] HealthCheck item)
        {
            await _cosmosDbService.UpdateAsync(item.id, item);
            return NoContent();
        }

        // DELETE /HealthCheck/23dbf68d-3f40-41de-ae1b-8e3558cd17f9
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _cosmosDbService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet]
        [Route("GetStatus")]
        public HealthCheck GetStatus()
        {
            var symptoms = new string[]{"Hair loss", "Internal bleeding", "Temporary blindness", "Ennui"};

            HealthCheck hc = new HealthCheck();
            hc.id = Guid.NewGuid().ToString();
            hc.PatientID = 5;
            hc.Date = DateTime.Now;
            hc.HealthStatus = "I feel unwell";
            hc.Symptoms = symptoms;
            return hc;
        }
    }
}


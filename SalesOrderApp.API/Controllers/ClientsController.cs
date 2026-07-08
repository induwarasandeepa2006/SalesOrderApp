using Microsoft.AspNetCore.Mvc;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly IClientRepository _clientRepository;

    public ClientsController(IClientRepository clientRepository)
    {
        _clientRepository = clientRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var clients = await _clientRepository.GetAllAsync();
        return Ok(clients);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var client = await _clientRepository.GetByIdAsync(id);
        if (client == null) return NotFound();
        return Ok(client);
    }
[HttpPost]
    public async Task<IActionResult> Create([FromBody] Client client)
    {
        var created = await _clientRepository.AddAsync(client);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

}
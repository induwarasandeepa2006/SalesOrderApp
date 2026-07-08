using SalesOrderApp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using SalesOrderApp.Application.Interfaces;

namespace SalesOrderApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IItemRepository _itemRepository;

    public ItemsController(IItemRepository itemRepository)
    {
        _itemRepository = itemRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _itemRepository.GetAllAsync();
        return Ok(items);
    }
[HttpPost]
    public async Task<IActionResult> Create([FromBody] Item item)
    {
        var created = await _itemRepository.AddAsync(item);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _itemRepository.GetByIdAsync(id);
        if (item == null) return NotFound();
        return Ok(item);
    }
}
using Microsoft.AspNetCore.Mvc;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;

namespace SalesOrderApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesOrdersController : ControllerBase
{
    private readonly ISalesOrderService _salesOrderService;

    public SalesOrdersController(ISalesOrderService salesOrderService)
    {
        _salesOrderService = salesOrderService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _salesOrderService.GetAllAsync();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _salesOrderService.GetByIdAsync(id);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SalesOrderDto orderDto)
    {
        var created = await _salesOrderService.CreateAsync(orderDto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] SalesOrderDto orderDto)
    {
        var updated = await _salesOrderService.UpdateAsync(id, orderDto);
        if (updated == null) return NotFound();
        return Ok(updated);
    }
}
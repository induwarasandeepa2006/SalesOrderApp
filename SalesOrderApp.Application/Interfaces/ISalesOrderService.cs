using SalesOrderApp.Application.DTOs;

namespace SalesOrderApp.Application.Interfaces;

public interface ISalesOrderService
{
    Task<List<SalesOrderDto>> GetAllAsync();
    Task<SalesOrderDto?> GetByIdAsync(int id);
    Task<SalesOrderDto> CreateAsync(SalesOrderDto orderDto);
    Task<SalesOrderDto?> UpdateAsync(int id, SalesOrderDto orderDto);
}

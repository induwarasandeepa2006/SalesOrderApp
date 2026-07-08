using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Interfaces;

public interface ISalesOrderRepository
{
    Task<List<SalesOrder>> GetAllAsync();
    Task<SalesOrder?> GetByIdAsync(int id);
    Task<SalesOrder> AddAsync(SalesOrder order);
    Task UpdateAsync(SalesOrder order);
}
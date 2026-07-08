using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Interfaces;

public interface IItemRepository
{
    Task<List<Item>> GetAllAsync();
    Task<Item?> GetByIdAsync(int id);
    Task<Item> AddAsync(Item item);
}
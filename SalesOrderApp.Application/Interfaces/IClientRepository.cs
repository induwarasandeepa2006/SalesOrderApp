using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Interfaces;

public interface IClientRepository
{
    Task<List<Client>> GetAllAsync();
    Task<Client?> GetByIdAsync(int id);
    Task<Client> AddAsync(Client client);
}
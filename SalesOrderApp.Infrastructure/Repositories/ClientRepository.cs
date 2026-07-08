using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Data;

namespace SalesOrderApp.Infrastructure.Repositories;

public class ClientRepository : IClientRepository
{
    private readonly AppDbContext _context;

    public ClientRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Client>> GetAllAsync()
    {
        return await _context.Clients.ToListAsync();
    }

    public async Task<Client?> GetByIdAsync(int id)
    {
        return await _context.Clients.FindAsync(id);
    }
public async Task<Client> AddAsync(Client client)
    {
        _context.Clients.Add(client);
        await _context.SaveChangesAsync();
        return client;
    }
}
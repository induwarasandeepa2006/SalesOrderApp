using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Data;

namespace SalesOrderApp.Infrastructure.Repositories;

public class SalesOrderRepository : ISalesOrderRepository
{
    private readonly AppDbContext _context;

    public SalesOrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SalesOrder>> GetAllAsync()
    {
        return await _context.SalesOrders
            .Include(o => o.Client)
            .Include(o => o.Lines)
                .ThenInclude(l => l.Item)
            .ToListAsync();
    }

    public async Task<SalesOrder?> GetByIdAsync(int id)
    {
        return await _context.SalesOrders
            .Include(o => o.Client)
            .Include(o => o.Lines)
                .ThenInclude(l => l.Item)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<SalesOrder> AddAsync(SalesOrder order)
    {
        _context.SalesOrders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task UpdateAsync(SalesOrder order)
    {
        _context.SalesOrders.Update(order);
        await _context.SaveChangesAsync();
    }
}
using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
    public DbSet<SalesOrderLine> SalesOrderLines => Set<SalesOrderLine>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Precision for money fields - important for SQL Server
        modelBuilder.Entity<Item>().Property(i => i.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrder>().Property(o => o.TotalExcl).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrder>().Property(o => o.TotalTax).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrder>().Property(o => o.TotalIncl).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrderLine>().Property(l => l.Quantity).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrderLine>().Property(l => l.TaxRate).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrderLine>().Property(l => l.ExclAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrderLine>().Property(l => l.TaxAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<SalesOrderLine>().Property(l => l.InclAmount).HasColumnType("decimal(18,2)");
    }
}
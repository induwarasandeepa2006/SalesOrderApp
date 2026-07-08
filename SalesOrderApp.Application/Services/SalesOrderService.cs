using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Services;

public class SalesOrderService : ISalesOrderService
{
    private readonly ISalesOrderRepository _orderRepository;
    private readonly IItemRepository _itemRepository;

    public SalesOrderService(ISalesOrderRepository orderRepository, IItemRepository itemRepository)
    {
        _orderRepository = orderRepository;
        _itemRepository = itemRepository;
    }

    public async Task<List<SalesOrderDto>> GetAllAsync()
    {
        var orders = await _orderRepository.GetAllAsync();
        return orders.Select(MapToDto).ToList();
    }

    public async Task<SalesOrderDto?> GetByIdAsync(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        return order == null ? null : MapToDto(order);
    }

    public async Task<SalesOrderDto> CreateAsync(SalesOrderDto orderDto)
    {
        var order = new SalesOrder
        {
            InvoiceNo = orderDto.InvoiceNo,
            InvoiceDate = orderDto.InvoiceDate,
            ReferenceNo = orderDto.ReferenceNo,
            ClientId = orderDto.ClientId,
            Lines = new List<SalesOrderLine>()
        };

        await CalculateAndPopulateLines(order, orderDto.Lines);
        CalculateOrderTotals(order);

        var created = await _orderRepository.AddAsync(order);
        return MapToDto(created);
    }

    public async Task<SalesOrderDto?> UpdateAsync(int id, SalesOrderDto orderDto)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null) return null;

        order.InvoiceNo = orderDto.InvoiceNo;
        order.InvoiceDate = orderDto.InvoiceDate;
        order.ReferenceNo = orderDto.ReferenceNo;
        order.ClientId = orderDto.ClientId;

        order.Lines.Clear();
        await CalculateAndPopulateLines(order, orderDto.Lines);
        CalculateOrderTotals(order);

        await _orderRepository.UpdateAsync(order);
        return MapToDto(order);
    }

    // --- Calculation logic straight from the assessment spec ---
    private async Task CalculateAndPopulateLines(SalesOrder order, List<SalesOrderLineDto> lineDtos)
    {
        foreach (var lineDto in lineDtos)
        {
            var item = await _itemRepository.GetByIdAsync(lineDto.ItemId);
            if (item == null) continue;

            var exclAmount = lineDto.Quantity * item.Price;
            var taxAmount = exclAmount * lineDto.TaxRate / 100;
            var inclAmount = exclAmount + taxAmount;

            order.Lines.Add(new SalesOrderLine
            {
                ItemId = lineDto.ItemId,
                Note = lineDto.Note,
                Quantity = lineDto.Quantity,
                TaxRate = lineDto.TaxRate,
                ExclAmount = exclAmount,
                TaxAmount = taxAmount,
                InclAmount = inclAmount
            });
        }
    }

    private static void CalculateOrderTotals(SalesOrder order)
    {
        order.TotalExcl = order.Lines.Sum(l => l.ExclAmount);
        order.TotalTax = order.Lines.Sum(l => l.TaxAmount);
        order.TotalIncl = order.Lines.Sum(l => l.InclAmount);
    }

    private static SalesOrderDto MapToDto(SalesOrder order)
    {
        return new SalesOrderDto
        {
            Id = order.Id,
            InvoiceNo = order.InvoiceNo,
            InvoiceDate = order.InvoiceDate,
            ReferenceNo = order.ReferenceNo,
            ClientId = order.ClientId,
            TotalExcl = order.TotalExcl,
            TotalTax = order.TotalTax,
            TotalIncl = order.TotalIncl,
            Lines = order.Lines.Select(l => new SalesOrderLineDto
            {
                Id = l.Id,
                ItemId = l.ItemId,
                Note = l.Note,
                Quantity = l.Quantity,
                TaxRate = l.TaxRate,
                ExclAmount = l.ExclAmount,
                TaxAmount = l.TaxAmount,
                InclAmount = l.InclAmount
            }).ToList()
        };
    }
}
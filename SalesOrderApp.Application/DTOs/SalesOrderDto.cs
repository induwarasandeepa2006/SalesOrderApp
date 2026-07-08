namespace SalesOrderApp.Application.DTOs;

public class SalesOrderDto
{
    public int Id { get; set; }
    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public string? ReferenceNo { get; set; }
    public int ClientId { get; set; }
    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }
    public List<SalesOrderLineDto> Lines { get; set; } = new();
}
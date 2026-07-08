namespace SalesOrderApp.Application.DTOs;

public class SalesOrderLineDto
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public string? Note { get; set; }
    public decimal Quantity { get; set; }
    public decimal TaxRate { get; set; }
    public decimal ExclAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal InclAmount { get; set; }
}
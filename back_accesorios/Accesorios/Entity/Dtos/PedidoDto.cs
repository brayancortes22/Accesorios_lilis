using Entity.Dtos.Base;

namespace Entity.Dtos
{
    public class PedidoDto : BaseDto
    {
        public string Numero { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Impuestos { get; set; }
        public decimal CostoEnvio { get; set; }
        public DateTime FechaPedido { get; set; }
        public DateTime? FechaEntrega { get; set; }
        public string? DireccionEnvio { get; set; }
        public string? CiudadEnvio { get; set; }
        public string? PaisEnvio { get; set; }
        public string? TelefonoContacto { get; set; }
        public string? Notas { get; set; }
        public string? MetodoPago { get; set; }
        public string? ReferenciaPago { get; set; }
        public int UsuarioId { get; set; }
        public string? UsuarioNombre { get; set; }
        public bool Activo { get; set; }
        public List<PedidoProductoDto> Productos { get; set; } = new List<PedidoProductoDto>();
    }

    public class PedidoCreateDto
    {
        public string Name { get; set; } = "Pedido";
        public string Description { get; set; } = string.Empty;
        public string? DireccionEnvio { get; set; }
        public string? CiudadEnvio { get; set; }
        public string? PaisEnvio { get; set; }
        public string? TelefonoContacto { get; set; }
        public string? Notas { get; set; }
        public string MetodoPago { get; set; } = string.Empty;
        public string? ReferenciaPago { get; set; }
        public int UsuarioId { get; set; }
        public List<PedidoProductoCreateDto> Productos { get; set; } = new List<PedidoProductoCreateDto>();
    }

    public class PedidoUpdateDto
    {
        public int Id { get; set; }
        public string Estado { get; set; } = string.Empty;
        public DateTime? FechaEntrega { get; set; }
        public string? Notas { get; set; }
        public string? ReferenciaPago { get; set; }
    }

    public class PedidoProductoDto : BaseDto
    {
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
        public string? Personalizacion { get; set; }
        public string? Notas { get; set; }
        public int PedidoId { get; set; }
        public int ProductoId { get; set; }
        public string? ProductoNombre { get; set; }
        public string? ProductoImagenUrl { get; set; }
        public bool Activo { get; set; }
    }

    public class PedidoProductoCreateDto
    {
        public int ProductoId { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public string? Personalizacion { get; set; }
        public string? Notas { get; set; }
    }

    public class CrearPedidoDesdeCarritoDto
    {
        public int UsuarioId { get; set; }
        public int CarritoId { get; set; }
        public string? DireccionEnvio { get; set; }
        public string? CiudadEnvio { get; set; }
        public string? PaisEnvio { get; set; }
        public string? TelefonoContacto { get; set; }
        public string? Notas { get; set; }
        public string MetodoPago { get; set; } = string.Empty;
        public string? ReferenciaPago { get; set; }
    }
}

using Entity.Dtos.Base;

namespace Entity.Dtos
{
    public class CarritoDto : BaseDto
    {
        public string Estado { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaActualizacion { get; set; }
        public int UsuarioId { get; set; }
        public string? UsuarioNombre { get; set; }
        public bool Activo { get; set; }
        public List<CarritoProductoDto> Productos { get; set; } = new List<CarritoProductoDto>();
        public decimal Total { get; set; }
        public int CantidadProductos { get; set; }
    }

    public class CarritoCreateDto
    {
        public string Name { get; set; } = "Carrito";
        public string Description { get; set; } = "Carrito de compras";
        public string Estado { get; set; } = "Activo";
        public int UsuarioId { get; set; }
        public bool Activo { get; set; } = true;
    }

    public class CarritoProductoDto : BaseDto
    {
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime FechaAgregado { get; set; }
        public int CarritoId { get; set; }
        public int ProductoId { get; set; }
        public string? ProductoNombre { get; set; }
        public string? ProductoImagenUrl { get; set; }
        public bool Activo { get; set; }
    }

    public class CarritoProductoCreateDto
    {
        public string Name { get; set; } = "Producto en carrito";
        public string Description { get; set; } = string.Empty;
        public int Cantidad { get; set; } = 1;
        public decimal PrecioUnitario { get; set; }
        public int CarritoId { get; set; }
        public int ProductoId { get; set; }
        public bool Activo { get; set; } = true;
    }

    public class CarritoProductoUpdateDto
    {
        public int Id { get; set; }
        public int Cantidad { get; set; }
        public bool Activo { get; set; }
    }

    public class AgregarProductoCarritoDto
    {
        public int UsuarioId { get; set; }
        public int ProductoId { get; set; }
        public int Cantidad { get; set; } = 1;
    }
}

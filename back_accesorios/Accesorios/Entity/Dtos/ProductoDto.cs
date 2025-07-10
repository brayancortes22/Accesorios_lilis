using Entity.Dtos.Base;

namespace Entity.Dtos
{
    public class ProductoDto : BaseDto
    {
        public string Nombre { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? ImagenUrl { get; set; }
        public int Stock { get; set; }
        public string? Material { get; set; }
        public string? Color { get; set; }
        public string? Tamaño { get; set; }
        public bool EsEncargo { get; set; }
        public bool Destacado { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int SeccionId { get; set; }
        public string? SeccionNombre { get; set; }
        public bool Activo { get; set; }
    }

    public class ProductoCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? ImagenUrl { get; set; }
        public int Stock { get; set; }
        public string? Material { get; set; }
        public string? Color { get; set; }
        public string? Tamaño { get; set; }
        public bool EsEncargo { get; set; } = false;
        public bool Destacado { get; set; } = false;
        public int SeccionId { get; set; }
        public bool Activo { get; set; } = true;
    }

    public class ProductoUpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? ImagenUrl { get; set; }
        public int Stock { get; set; }
        public string? Material { get; set; }
        public string? Color { get; set; }
        public string? Tamaño { get; set; }
        public bool EsEncargo { get; set; }
        public bool Destacado { get; set; }
        public int SeccionId { get; set; }
        public bool Activo { get; set; }
    }

    public class ProductoListDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? ImagenUrl { get; set; }
        public int Stock { get; set; }
        public bool EsEncargo { get; set; }
        public bool Destacado { get; set; }
        public string? SeccionNombre { get; set; }
        public bool Activo { get; set; }
    }
}

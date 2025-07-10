using Entity.Dtos.Base;

namespace Entity.Dtos
{
    public class SeccionDto : BaseDto
    {
        public string Codigo { get; set; } = string.Empty;
        public string? ImagenUrl { get; set; }
        public int Orden { get; set; }
        public bool Activo { get; set; }
        public int CantidadProductos { get; set; }
    }

    public class SeccionCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public string? ImagenUrl { get; set; }
        public int Orden { get; set; } = 0;
        public bool Activo { get; set; } = true;
    }

    public class SeccionUpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public string? ImagenUrl { get; set; }
        public int Orden { get; set; }
        public bool Activo { get; set; }
    }
}

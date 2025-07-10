using Entity.Dtos.Base;

namespace Entity.Dtos
{
    public class RolDto : BaseDto
    {
        public string Codigo { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }

    public class RolCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public bool Activo { get; set; } = true;
    }

    public class RolUpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }
}

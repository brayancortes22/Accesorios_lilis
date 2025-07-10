using Entity.Dtos.Base;

namespace Entity.Dtos
{
    public class UsuarioDto : BaseDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
        public string? Ciudad { get; set; }
        public string? Pais { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int RolId { get; set; }
        public string? RolNombre { get; set; }
        public bool Activo { get; set; }
    }

    public class UsuarioCreateDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
        public string? Ciudad { get; set; }
        public string? Pais { get; set; }
        public int RolId { get; set; } = 2; // Cliente por defecto
        public bool Activo { get; set; } = true;
    }

    public class UsuarioUpdateDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Direccion { get; set; }
        public string? Ciudad { get; set; }
        public string? Pais { get; set; }
        public bool Activo { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public UsuarioDto Usuario { get; set; } = null!;
        public string Token { get; set; } = string.Empty;
    }
}

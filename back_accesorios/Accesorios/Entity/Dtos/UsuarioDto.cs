using Entity.Dtos.Base;
using System;

namespace Entity.Dtos
{
    public class UsuarioDto : BaseDto
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public DateTime FechaRegistro { get; set; }
        public int RolId { get; set; }
        public string RolNombre { get; set; }
        public bool Activo { get; set; }
    }
}

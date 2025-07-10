using System;
using System.Collections.Generic;
using Entity.Model.Base;

namespace Entity.Model
{
    public class Usuario : BaseModel
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
        public int RolId { get; set; }
        public Rol Rol { get; set; }
        public bool Activo { get; set; } = true;
        public ICollection<Carrito> Carritos { get; set; }
        public ICollection<Pedido> Pedidos { get; set; }
    }
}

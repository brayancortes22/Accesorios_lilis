using System;
using System.Collections.Generic;
using Entity.Model.Base;

namespace Entity.Model
{
    public class Carrito : BaseModel
    {
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        public string Estado { get; set; } = "Activo";
        public ICollection<CarritoProducto> CarritoProductos { get; set; }
    }
}

using System.Collections.Generic;
using Entity.Model.Base;

namespace Entity.Model
{
    public class Producto : BaseModel
    {
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public string ImagenUrl { get; set; }
        public int SeccionId { get; set; }
        public Seccion Seccion { get; set; }
        public bool EsEncargo { get; set; }
        public string Material { get; set; }
        public ICollection<CarritoProducto> CarritoProductos { get; set; }
        public ICollection<PedidoProducto> PedidoProductos { get; set; }
    }
}

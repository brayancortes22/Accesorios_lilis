using System;
using System.Collections.Generic;
using Entity.Model.Base;

namespace Entity.Model
{
    public class Pedido : BaseModel
    {
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        public DateTime FechaPedido { get; set; } = DateTime.Now;
        public decimal Total { get; set; }
        public string Estado { get; set; } = "Pendiente";
        public bool WhatsappEnviado { get; set; }
        public string MetodoPago { get; set; }
        public string DireccionEntrega { get; set; }
        public string Comentarios { get; set; }
        public ICollection<PedidoProducto> PedidoProductos { get; set; }
        public ICollection<WhatsappMensaje> WhatsappMensajes { get; set; }
    }
}

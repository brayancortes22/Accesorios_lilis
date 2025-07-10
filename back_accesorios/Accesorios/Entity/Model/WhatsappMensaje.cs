using System;
using Entity.Model.Base;

namespace Entity.Model
{
    public class WhatsappMensaje : BaseModel
    {
        public int PedidoId { get; set; }
        public Pedido Pedido { get; set; }
        public string Mensaje { get; set; }
        public DateTime FechaEnvio { get; set; } = DateTime.Now;
        public string EstadoEnvio { get; set; } = "Pendiente";
    }
}

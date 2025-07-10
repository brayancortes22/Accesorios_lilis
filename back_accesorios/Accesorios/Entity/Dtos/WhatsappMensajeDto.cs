using Entity.Dtos.Base;
using System;

namespace Entity.Dtos
{
    public class WhatsappMensajeDto : BaseDto
    {
        public int PedidoId { get; set; }
        public string Mensaje { get; set; }
        public DateTime FechaEnvio { get; set; }
        public string EstadoEnvio { get; set; }
    }
}

using Entity.Dtos.Base;
using System;
using System.Collections.Generic;

namespace Entity.Dtos
{
    public class PedidoDto : BaseDto
    {
        public int UsuarioId { get; set; }
        public string UsuarioNombre { get; set; }
        public DateTime FechaPedido { get; set; }
        public decimal Total { get; set; }
        public string Estado { get; set; }
        public bool WhatsappEnviado { get; set; }
        public string MetodoPago { get; set; }
        public string DireccionEntrega { get; set; }
        public string Comentarios { get; set; }
        public List<PedidoProductoDto> Productos { get; set; }
    }
}

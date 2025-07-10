using Entity.Dtos.Base;

namespace Entity.Dtos
{
    public class PedidoProductoDto : BaseDto
    {
        public int PedidoId { get; set; }
        public int ProductoId { get; set; }
        public string ProductoNombre { get; set; }
        public int Cantidad { get; set; }
        public string DetalleEncargo { get; set; }
    }
}

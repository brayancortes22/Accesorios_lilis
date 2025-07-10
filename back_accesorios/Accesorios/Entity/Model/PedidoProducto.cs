using Entity.Model.Base;

namespace Entity.Model
{
    public class PedidoProducto : BaseModel
    {
        public int PedidoId { get; set; }
        public Pedido Pedido { get; set; }
        public int ProductoId { get; set; }
        public Producto Producto { get; set; }
        public int Cantidad { get; set; }
        public string DetalleEncargo { get; set; }
    }
}

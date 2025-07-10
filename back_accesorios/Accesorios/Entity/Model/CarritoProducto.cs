using Entity.Model.Base;

namespace Entity.Model
{
    public class CarritoProducto : BaseModel
    {
        public int CarritoId { get; set; }
        public Carrito Carrito { get; set; }
        public int ProductoId { get; set; }
        public Producto Producto { get; set; }
        public int Cantidad { get; set; }
        public string DetalleEncargo { get; set; }
    }
}

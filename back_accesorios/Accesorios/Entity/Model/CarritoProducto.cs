using Entity.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Model
{
    [Table("CarritoProductos")]
    public class CarritoProducto : BaseModel
    {
        public int Cantidad { get; set; } = 1;

        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitario { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        public DateTime FechaAgregado { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public int CarritoId { get; set; }
        public int ProductoId { get; set; }

        // Navigation Properties
        [ForeignKey("CarritoId")]
        public virtual Carrito Carrito { get; set; } = null!;

        [ForeignKey("ProductoId")]
        public virtual Producto Producto { get; set; } = null!;
    }
}

using Entity.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Model
{
    [Table("PedidoProductos")]
    public class PedidoProducto : BaseModel
    {
        public int Cantidad { get; set; } = 1;

        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitario { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [StringLength(500)]
        public string? Personalizacion { get; set; }

        [StringLength(500)]
        public string? Notas { get; set; }

        // Foreign Keys
        public int PedidoId { get; set; }
        public int ProductoId { get; set; }

        // Navigation Properties
        [ForeignKey("PedidoId")]
        public virtual Pedido Pedido { get; set; } = null!;

        [ForeignKey("ProductoId")]
        public virtual Producto Producto { get; set; } = null!;
    }
}

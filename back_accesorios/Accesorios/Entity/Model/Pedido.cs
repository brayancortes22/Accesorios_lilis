using Entity.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Model
{
    [Table("Pedidos")]
    public class Pedido : BaseModel
    {
        [Required]
        [StringLength(50)]
        public string Numero { get; set; } = string.Empty;

        [StringLength(50)]
        public string Estado { get; set; } = "Pendiente";

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Impuestos { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal CostoEnvio { get; set; } = 0;

        public DateTime FechaPedido { get; set; } = DateTime.UtcNow;

        public DateTime? FechaEntrega { get; set; }

        [StringLength(255)]
        public string? DireccionEnvio { get; set; }

        [StringLength(100)]
        public string? CiudadEnvio { get; set; }

        [StringLength(100)]
        public string? PaisEnvio { get; set; }

        [StringLength(20)]
        public string? TelefonoContacto { get; set; }

        [StringLength(500)]
        public string? Notas { get; set; }

        [StringLength(50)]
        public string? MetodoPago { get; set; }

        [StringLength(100)]
        public string? ReferenciaPago { get; set; }

        // Foreign Key
        public int UsuarioId { get; set; }

        // Navigation Properties
        [ForeignKey("UsuarioId")]
        public virtual Usuario Usuario { get; set; } = null!;

        public virtual ICollection<PedidoProducto> PedidoProductos { get; set; } = new List<PedidoProducto>();
    }
}

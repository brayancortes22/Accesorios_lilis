using Entity.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Model
{
    [Table("Productos")]
    public class Producto : BaseModel
    {
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Precio { get; set; }

        [StringLength(255)]
        public string? ImagenUrl { get; set; }

        public int Stock { get; set; } = 0;

        [StringLength(100)]
        public string? Material { get; set; }

        [StringLength(50)]
        public string? Color { get; set; }

        [StringLength(50)]
        public string? Tamaño { get; set; }

        public bool EsEncargo { get; set; } = false;

        public bool Destacado { get; set; } = false;

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        // Foreign Key
        public int SeccionId { get; set; }

        // Navigation Properties
        [ForeignKey("SeccionId")]
        public virtual Seccion Seccion { get; set; } = null!;

        public virtual ICollection<CarritoProducto> CarritoProductos { get; set; } = new List<CarritoProducto>();
        public virtual ICollection<PedidoProducto> PedidoProductos { get; set; } = new List<PedidoProducto>();
    }
}

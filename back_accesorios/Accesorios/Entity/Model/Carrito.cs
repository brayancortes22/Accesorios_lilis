using Entity.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Model
{
    [Table("Carritos")]
    public class Carrito : BaseModel
    {
        [StringLength(50)]
        public string Estado { get; set; } = "Activo";

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public DateTime? FechaActualizacion { get; set; }

        // Foreign Key
        public int UsuarioId { get; set; }

        // Navigation Properties
        [ForeignKey("UsuarioId")]
        public virtual Usuario Usuario { get; set; } = null!;

        public virtual ICollection<CarritoProducto> CarritoProductos { get; set; } = new List<CarritoProducto>();
    }
}

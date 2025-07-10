using Entity.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Model
{
    [Table("Secciones")]
    public class Seccion : BaseModel
    {
        [Required]
        [StringLength(50)]
        public string Codigo { get; set; } = string.Empty;

        [StringLength(255)]
        public string? ImagenUrl { get; set; }

        public int Orden { get; set; } = 0;

        // Navigation Properties
        public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
    }
}

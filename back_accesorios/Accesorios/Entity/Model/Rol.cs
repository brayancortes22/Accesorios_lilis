using Entity.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Model
{
    [Table("Roles")]
    public class Rol : BaseModel
    {
        [Required]
        [StringLength(50)]
        public string Codigo { get; set; } = string.Empty;

        // Navigation Properties
        public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    }
}

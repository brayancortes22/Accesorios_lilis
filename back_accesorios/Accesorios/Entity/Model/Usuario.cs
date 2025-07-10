using Entity.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Model
{
    [Table("Usuarios")]
    public class Usuario : BaseModel
    {
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Telefono { get; set; }

        [StringLength(255)]
        public string? Direccion { get; set; }

        [StringLength(100)]
        public string? Ciudad { get; set; }

        [StringLength(100)]
        public string? Pais { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        // Foreign Key
        public int RolId { get; set; }

        // Navigation Properties
        [ForeignKey("RolId")]
        public virtual Rol Rol { get; set; } = null!;

        public virtual ICollection<Carrito> Carritos { get; set; } = new List<Carrito>();
        public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
        public virtual ICollection<WhatsappMensaje> WhatsappMensajes { get; set; } = new List<WhatsappMensaje>();
    }
}

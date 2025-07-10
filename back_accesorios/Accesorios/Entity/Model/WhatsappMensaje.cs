using Entity.Model.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity.Model
{
    [Table("WhatsappMensajes")]
    public class WhatsappMensaje : BaseModel
    {
        [Required]
        [StringLength(20)]
        public string NumeroTelefono { get; set; } = string.Empty;

        [Required]
        public string Mensaje { get; set; } = string.Empty;

        [StringLength(50)]
        public string Tipo { get; set; } = "Consulta"; // Consulta, Pedido, Reclamo, etc.

        [StringLength(50)]
        public string Estado { get; set; } = "Pendiente"; // Pendiente, Leído, Respondido

        public DateTime FechaEnvio { get; set; } = DateTime.UtcNow;

        public DateTime? FechaLectura { get; set; }

        public DateTime? FechaRespuesta { get; set; }

        [StringLength(100)]
        public string? NombreContacto { get; set; }

        // Foreign Key (opcional, si el mensaje está asociado a un usuario registrado)
        public int? UsuarioId { get; set; }

        // Navigation Properties
        [ForeignKey("UsuarioId")]
        public virtual Usuario? Usuario { get; set; }
    }
}

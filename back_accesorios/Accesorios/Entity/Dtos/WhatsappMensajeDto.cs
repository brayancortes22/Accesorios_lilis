using Entity.Dtos.Base;

namespace Entity.Dtos
{
    public class WhatsappMensajeDto : BaseDto
    {
        public string NumeroTelefono { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public DateTime FechaEnvio { get; set; }
        public DateTime? FechaLectura { get; set; }
        public DateTime? FechaRespuesta { get; set; }
        public string? NombreContacto { get; set; }
        public int? UsuarioId { get; set; }
        public string? UsuarioNombre { get; set; }
        public bool Activo { get; set; }
    }

    public class WhatsappMensajeCreateDto
    {
        public string Name { get; set; } = "Mensaje WhatsApp";
        public string Description { get; set; } = string.Empty;
        public string NumeroTelefono { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;
        public string Tipo { get; set; } = "Consulta";
        public string? NombreContacto { get; set; }
        public int? UsuarioId { get; set; }
        public bool Activo { get; set; } = true;
    }

    public class WhatsappMensajeUpdateDto
    {
        public int Id { get; set; }
        public string Estado { get; set; } = string.Empty;
        public DateTime? FechaLectura { get; set; }
        public DateTime? FechaRespuesta { get; set; }
    }

    public class EnviarMensajeWhatsappDto
    {
        public string NumeroTelefono { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;
        public string? NombreContacto { get; set; }
        public string Tipo { get; set; } = "Consulta";
        public int? UsuarioId { get; set; }
    }
}

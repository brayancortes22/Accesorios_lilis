using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class WhatsappMensajeProfile : Profile
    {
        public WhatsappMensajeProfile()
        {
            // WhatsappMensaje <-> WhatsappMensajeDto (bidireccional)
            CreateMap<WhatsappMensaje, WhatsappMensajeDto>()
                .ForMember(dest => dest.UsuarioNombre, opt => opt.MapFrom(src => src.Usuario != null ? src.Usuario.Nombre : null))
                .ForMember(dest => dest.Activo, opt => opt.MapFrom(src => src.Active))
                .ReverseMap()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.Usuario, opt => opt.Ignore()); // Ignoramos la navegación

            // EnviarMensajeWhatsappDto -> WhatsappMensaje
            CreateMap<EnviarMensajeWhatsappDto, WhatsappMensaje>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.FechaEnvio, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => "Pendiente"))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => "Mensaje WhatsApp"))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Mensaje.Length > 50 ? src.Mensaje.Substring(0, 50) + "..." : src.Mensaje));

            // WhatsappMensajeUpdateDto -> WhatsappMensaje
            CreateMap<WhatsappMensajeUpdateDto, WhatsappMensaje>()
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.Estado))
                .ForMember(dest => dest.FechaLectura, opt => opt.MapFrom(src => src.FechaLectura))
                .ForMember(dest => dest.FechaRespuesta, opt => opt.MapFrom(src => src.FechaRespuesta));
        }
    }
}

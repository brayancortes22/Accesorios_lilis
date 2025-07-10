using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class WhatsappMensajeProfile : Profile
    {
        public WhatsappMensajeProfile()
        {
            CreateMap<WhatsappMensaje, WhatsappMensajeDto>().ReverseMap();
        }
    }
}

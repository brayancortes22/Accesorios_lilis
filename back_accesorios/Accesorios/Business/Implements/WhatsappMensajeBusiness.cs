using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    public class WhatsappMensajeBusiness : BaseBusiness<WhatsappMensaje, WhatsappMensajeDto>, IWhatsappMensajeBusiness
    {
        public WhatsappMensajeBusiness(IWhatsappMensajeData data, IMapper mapper, ILogger<WhatsappMensajeBusiness> logger)
            : base(data, mapper, logger) { }
    }
}

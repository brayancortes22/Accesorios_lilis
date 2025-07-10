using Microsoft.AspNetCore.Mvc;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;
using Web.Controllers.Implements;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    public class WhatsappMensajeController : GenericController<WhatsappMensajeDto, WhatsappMensaje>
    {
        public WhatsappMensajeController(IWhatsappMensajeBusiness business, ILogger<WhatsappMensajeController> logger)
            : base(business, logger) { }

        protected override int GetEntityId(WhatsappMensajeDto dto) => dto.Id;
    }
}

using Microsoft.AspNetCore.Mvc;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;
using Web.Controllers.Implements;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    public class PedidoController : GenericController<PedidoDto, Pedido>
    {
        public PedidoController(IPedidoBusiness business, ILogger<PedidoController> logger)
            : base(business, logger) { }

        protected override int GetEntityId(PedidoDto dto) => dto.Id;
    }
}

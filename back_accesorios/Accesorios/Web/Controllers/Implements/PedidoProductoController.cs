using Microsoft.AspNetCore.Mvc;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;
using Web.Controllers.Implements;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    public class PedidoProductoController : GenericController<PedidoProductoDto, PedidoProducto>
    {
        public PedidoProductoController(IPedidoProductoBusiness business, ILogger<PedidoProductoController> logger)
            : base(business, logger) { }

        protected override int GetEntityId(PedidoProductoDto dto) => dto.Id;
    }
}

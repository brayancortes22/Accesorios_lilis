using Microsoft.AspNetCore.Mvc;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;
using Web.Controllers.Implements;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    public class CarritoProductoController : GenericController<CarritoProductoDto, CarritoProducto>
    {
        public CarritoProductoController(ICarritoProductoBusiness business, ILogger<CarritoProductoController> logger)
            : base(business, logger) { }

        protected override int GetEntityId(CarritoProductoDto dto) => dto.Id;
    }
}

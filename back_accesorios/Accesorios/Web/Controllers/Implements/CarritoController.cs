using Microsoft.AspNetCore.Mvc;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;
using Web.Controllers.Implements;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    public class CarritoController : GenericController<CarritoDto, Carrito>
    {
        public CarritoController(ICarritoBusiness business, ILogger<CarritoController> logger)
            : base(business, logger) { }

        protected override int GetEntityId(CarritoDto dto) => dto.Id;
    }
}

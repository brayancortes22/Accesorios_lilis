using Microsoft.AspNetCore.Mvc;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;
using Web.Controllers.Implements;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    public class ProductoController : GenericController<ProductoDto, Producto>
    {
        public ProductoController(IProductoBusiness business, ILogger<ProductoController> logger)
            : base(business, logger) { }

        protected override int GetEntityId(ProductoDto dto) => dto.Id;
    }
}

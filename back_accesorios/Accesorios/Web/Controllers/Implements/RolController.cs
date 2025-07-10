using Microsoft.AspNetCore.Mvc;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;
using Web.Controllers.Implements;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    public class RolController : GenericController<RolDto, Rol>
    {
        public RolController(IRolBusiness business, ILogger<RolController> logger)
            : base(business, logger) { }

        protected override int GetEntityId(RolDto dto) => dto.Id;
    }
}

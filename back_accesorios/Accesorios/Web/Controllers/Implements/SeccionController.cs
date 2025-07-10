using Microsoft.AspNetCore.Mvc;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;
using Web.Controllers.Implements;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    public class SeccionController : GenericController<SeccionDto, Seccion>
    {
        public SeccionController(ISeccionBusiness business, ILogger<SeccionController> logger)
            : base(business, logger) { }

        protected override int GetEntityId(SeccionDto dto) => dto.Id;
    }
}

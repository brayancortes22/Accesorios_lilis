using Microsoft.AspNetCore.Mvc;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;
using Web.Controllers.Implements;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    public class UsuarioController : GenericController<UsuarioDto, Usuario>
    {
        public UsuarioController(IUsuarioBusiness business, ILogger<UsuarioController> logger)
            : base(business, logger) { }

        protected override int GetEntityId(UsuarioDto dto) => dto.Id;
    }
}

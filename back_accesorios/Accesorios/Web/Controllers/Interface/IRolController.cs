using Entity.Dtos;
using Entity.Model;
using Microsoft.AspNetCore.Mvc;
using Web.Controllers.Interface;

namespace Web.Controllers.Interface
{
    public interface IRolController : IGenericController<RolDto, Rol> { }
}

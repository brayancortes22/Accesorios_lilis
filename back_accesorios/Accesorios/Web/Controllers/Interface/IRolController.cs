using Microsoft.AspNetCore.Mvc;
using Entity.Dtos;
using Entity.Model;

namespace Web.Controllers.Interface
{
    public interface IRolController : IGenericController<RolDto, Rol>
    {
        /// <summary>
        /// Obtiene todos los roles activos
        /// </summary>
        /// <returns>Lista de roles activos</returns>
        Task<IActionResult> GetActive();

        /// <summary>
        /// Obtiene un rol por nombre
        /// </summary>
        /// <param name="nombre">Nombre del rol</param>
        /// <returns>Rol encontrado</returns>
        Task<IActionResult> GetByName(string nombre);

        /// <summary>
        /// Obtiene usuarios por rol
        /// </summary>
        /// <param name="id">ID del rol</param>
        /// <returns>Lista de usuarios con el rol especificado</returns>
        Task<IActionResult> GetUsers(int id);

        /// <summary>
        /// Asigna un rol a un usuario
        /// </summary>
        /// <param name="request">Datos de asignación</param>
        /// <returns>Resultado de la operación</returns>
        Task<IActionResult> AssignToUser([FromBody] AssignRoleRequest request);

        /// <summary>
        /// Remueve un rol de un usuario
        /// </summary>
        /// <param name="request">Datos de remoción</param>
        /// <returns>Resultado de la operación</returns>
        Task<IActionResult> RemoveFromUser([FromBody] RemoveRoleRequest request);

        /// <summary>
        /// Obtiene las estadísticas de roles
        /// </summary>
        /// <returns>Estadísticas de roles</returns>
        Task<IActionResult> GetStatistics();
    }

    public class AssignRoleRequest
    {
        public int UsuarioId { get; set; }
        public int RolId { get; set; }
    }

    public class RemoveRoleRequest
    {
        public int UsuarioId { get; set; }
        public int RolId { get; set; }
    }
}

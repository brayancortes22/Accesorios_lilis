using Microsoft.AspNetCore.Mvc;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;
using Web.Controllers.Implements;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolController : GenericController<RolDto, Rol>
    {
        private readonly IRolBusiness _rolBusiness;
        private readonly IUsuarioBusiness _usuarioBusiness;

        public RolController(
            IRolBusiness business, 
            IUsuarioBusiness usuarioBusiness,
            ILogger<RolController> logger)
            : base(business, logger) 
        {
            _rolBusiness = business;
            _usuarioBusiness = usuarioBusiness;
        }

        protected override int GetEntityId(RolDto dto) => dto.Id;

        /// <summary>
        /// Obtener rol con conteo de usuarios
        /// </summary>
        [HttpGet("{id}/usuarios")]
        public async Task<IActionResult> GetRolConUsuarios(int id)
        {
            try
            {
                var rol = await _rolBusiness.GetByIdAsync(id);
                if (rol == null)
                {
                    return NotFound(new { message = "Rol no encontrado" });
                }

                var usuarios = await _usuarioBusiness.GetByRolIdAsync(id);

                var response = new
                {
                    rol = rol,
                    usuarios = usuarios,
                    totalUsuarios = usuarios.Count()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting rol with usuarios: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener todos los roles con conteo de usuarios
        /// </summary>
        [HttpGet("con-conteo")]
        public async Task<IActionResult> GetRolesConConteo()
        {
            try
            {
                var roles = await _rolBusiness.GetAllAsync();
                var todosLosUsuarios = await _usuarioBusiness.GetAllAsync();

                var rolesConConteo = roles.Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Description,
                    r.Activo,
                    TotalUsuarios = todosLosUsuarios.Count(u => u.RolId == r.Id),
                    UsuariosActivos = todosLosUsuarios.Count(u => u.RolId == r.Id && u.Activo)
                }).ToList();

                return Ok(rolesConConteo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting roles with count: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener roles activos (para formularios)
        /// </summary>
        [HttpGet("activos")]
        public async Task<IActionResult> GetRolesActivos()
        {
            try
            {
                var roles = await _rolBusiness.GetActivosAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting active roles: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Activar/Desactivar un rol
        /// </summary>
        [HttpPut("{id}/toggle-estado")]
        public async Task<IActionResult> ToggleEstado(int id)
        {
            try
            {
                var rol = await _rolBusiness.GetByIdAsync(id);
                if (rol == null)
                {
                    return NotFound(new { message = "Rol no encontrado" });
                }

                // Verificar que no sea un rol crítico (Admin o Cliente)
                if (rol.Name.ToLower() == "admin" || rol.Name.ToLower() == "cliente")
                {
                    return BadRequest(new { message = "No se puede desactivar un rol del sistema" });
                }

                // Cambiar el estado
                rol.Activo = !rol.Activo;
                var rolActualizado = await _rolBusiness.UpdateAsync(rol);

                return Ok(new { 
                    message = $"Rol {(rolActualizado.Activo ? "activado" : "desactivado")} exitosamente",
                    rol = rolActualizado
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error toggling rol status: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Crear nuevo rol
        /// </summary>
        public override async Task<IActionResult> Create([FromBody] RolDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Verificar que no exista un rol con el mismo nombre
                var roles = await _rolBusiness.GetAllAsync();
                if (roles.Any(r => r.Name.ToLower() == dto.Name.ToLower()))
                {
                    return BadRequest(new { message = "Ya existe un rol con ese nombre" });
                }

                var rol = await _rolBusiness.CreateAsync(dto);
                return Ok(new { 
                    message = "Rol creado exitosamente",
                    rol = rol
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating rol: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Actualizar rol
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RolDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var rolExistente = await _rolBusiness.GetByIdAsync(id);
                if (rolExistente == null)
                {
                    return NotFound(new { message = "Rol no encontrado" });
                }

                // Verificar que no sea un rol crítico del sistema
                if (rolExistente.Name.ToLower() == "admin" || rolExistente.Name.ToLower() == "cliente")
                {
                    return BadRequest(new { message = "No se puede modificar un rol del sistema" });
                }

                dto.Id = id; // Asegurar que el ID sea correcto
                var rol = await _rolBusiness.UpdateAsync(dto);

                return Ok(new { 
                    message = "Rol actualizado exitosamente",
                    rol = rol
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating rol: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Eliminar rol (solo si no tiene usuarios asignados)
        /// </summary>
        public override async Task<IActionResult> Delete(int id)
        {
            try
            {
                var rol = await _rolBusiness.GetByIdAsync(id);
                if (rol == null)
                {
                    return NotFound(new { message = "Rol no encontrado" });
                }

                // Verificar que no sea un rol crítico del sistema
                if (rol.Name.ToLower() == "admin" || rol.Name.ToLower() == "cliente")
                {
                    return BadRequest(new { message = "No se puede eliminar un rol del sistema" });
                }

                // Verificar que no tenga usuarios asignados
                var usuarios = await _usuarioBusiness.GetByRolIdAsync(id);
                if (usuarios.Any())
                {
                    return BadRequest(new { message = "No se puede eliminar un rol que tiene usuarios asignados" });
                }

                await _rolBusiness.DeleteAsync(id);
                return Ok(new { message = "Rol eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting rol: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }
}

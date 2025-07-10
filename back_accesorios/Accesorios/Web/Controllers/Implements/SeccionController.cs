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
    public class SeccionController : GenericController<SeccionDto, Seccion>
    {
        private readonly ISeccionBusiness _seccionBusiness;
        private readonly IProductoBusiness _productoBusiness;

        public SeccionController(
            ISeccionBusiness business, 
            IProductoBusiness productoBusiness,
            ILogger<SeccionController> logger)
            : base(business, logger) 
        {
            _seccionBusiness = business;
            _productoBusiness = productoBusiness;
        }

        protected override int GetEntityId(SeccionDto dto) => dto.Id;

        /// <summary>
        /// Obtener sección con sus productos
        /// </summary>
        [HttpGet("{id}/productos")]
        public async Task<IActionResult> GetSeccionConProductos(int id)
        {
            try
            {
                var seccion = await _seccionBusiness.GetByIdAsync(id);
                if (seccion == null)
                {
                    return NotFound(new { message = "Sección no encontrada" });
                }

                var productos = await _productoBusiness.GetBySeccionIdAsync(id);

                var response = new
                {
                    seccion = seccion,
                    productos = productos,
                    totalProductos = productos.Count()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting seccion with productos: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener todas las secciones con conteo de productos
        /// </summary>
        [HttpGet("con-conteo")]
        public async Task<IActionResult> GetSeccionesConConteo()
        {
            try
            {
                var secciones = await _seccionBusiness.GetAllAsync();
                var todosLosProductos = await _productoBusiness.GetAllAsync();

                var seccionesConConteo = secciones.Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Description,
                    s.Activo,
                    TotalProductos = todosLosProductos.Count(p => p.SeccionId == s.Id),
                    ProductosActivos = todosLosProductos.Count(p => p.SeccionId == s.Id && p.Activo)
                }).ToList();

                return Ok(seccionesConConteo);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting secciones with count: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener secciones activas (para el frontend público)
        /// </summary>
        [HttpGet("activas")]
        public async Task<IActionResult> GetSeccionesActivas()
        {
            try
            {
                var secciones = await _seccionBusiness.GetActivasAsync();
                return Ok(secciones);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting active secciones: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Activar/Desactivar una sección
        /// </summary>
        [HttpPut("{id}/toggle-estado")]
        public async Task<IActionResult> ToggleEstado(int id)
        {
            try
            {
                var seccion = await _seccionBusiness.GetByIdAsync(id);
                if (seccion == null)
                {
                    return NotFound(new { message = "Sección no encontrada" });
                }

                // Cambiar el estado
                seccion.Activo = !seccion.Activo;
                var seccionActualizada = await _seccionBusiness.UpdateAsync(seccion);

                return Ok(new { 
                    message = $"Sección {(seccionActualizada.Activo ? "activada" : "desactivada")} exitosamente",
                    seccion = seccionActualizada
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error toggling seccion status: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Crear nueva sección
        /// </summary>
        public override async Task<IActionResult> Create([FromBody] SeccionDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var seccion = await _seccionBusiness.CreateAsync(dto);
                return Ok(new { 
                    message = "Sección creada exitosamente",
                    seccion = seccion
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating seccion: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Actualizar sección
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SeccionDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                dto.Id = id; // Asegurar que el ID sea correcto
                var seccion = await _seccionBusiness.UpdateAsync(dto);
                
                if (seccion == null)
                {
                    return NotFound(new { message = "Sección no encontrada" });
                }

                return Ok(new { 
                    message = "Sección actualizada exitosamente",
                    seccion = seccion
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating seccion: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }
}

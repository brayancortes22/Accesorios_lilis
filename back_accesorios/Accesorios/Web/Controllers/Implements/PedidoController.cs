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
    public class PedidoController : GenericController<PedidoDto, Pedido>
    {
        private readonly IPedidoBusiness _pedidoBusiness;
        private readonly ICarritoBusiness _carritoBusiness;
        private readonly IUsuarioBusiness _usuarioBusiness;

        public PedidoController(
            IPedidoBusiness business, 
            ICarritoBusiness carritoBusiness,
            IUsuarioBusiness usuarioBusiness,
            ILogger<PedidoController> logger)
            : base(business, logger) 
        {
            _pedidoBusiness = business;
            _carritoBusiness = carritoBusiness;
            _usuarioBusiness = usuarioBusiness;
        }

        protected override int GetEntityId(PedidoDto dto) => dto.Id;

        /// <summary>
        /// Obtener pedidos por usuario
        /// </summary>
        [HttpGet("usuario/{usuarioId}")]
        public async Task<IActionResult> GetPedidosByUsuario(int usuarioId)
        {
            try
            {
                var pedidos = await _pedidoBusiness.GetByUsuarioIdAsync(usuarioId);
                return Ok(pedidos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting pedidos for user {usuarioId}: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Crear pedido desde carrito
        /// </summary>
        [HttpPost("crear-desde-carrito")]
        public async Task<IActionResult> CrearPedidoDesdeCarrito([FromBody] CrearPedidoDesdeCarritoDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var pedido = await _pedidoBusiness.CrearPedidoDesdeCarritoAsync(dto);
                
                if (pedido == null)
                {
                    return BadRequest(new { message = "No se pudo crear el pedido. Verifique que el carrito tenga productos." });
                }

                return Ok(new { 
                    message = "Pedido creado exitosamente",
                    pedido = pedido
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating pedido from carrito: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Actualizar estado del pedido
        /// </summary>
        [HttpPut("{id}/estado")]
        public async Task<IActionResult> ActualizarEstado(int id, [FromBody] ActualizarEstadoPedidoDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var pedido = await _pedidoBusiness.ActualizarEstadoAsync(id, dto.Estado, dto.Notas);
                
                if (pedido == null)
                {
                    return NotFound(new { message = "Pedido no encontrado" });
                }

                return Ok(new { 
                    message = "Estado del pedido actualizado exitosamente",
                    pedido = pedido
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating pedido status: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Confirmar entrega del pedido
        /// </summary>
        [HttpPut("{id}/confirmar-entrega")]
        public async Task<IActionResult> ConfirmarEntrega(int id, [FromBody] ConfirmarEntregaDto dto)
        {
            try
            {
                var pedido = await _pedidoBusiness.ConfirmarEntregaAsync(id, dto.FechaEntrega, dto.ReferenciaPago);
                
                if (pedido == null)
                {
                    return NotFound(new { message = "Pedido no encontrado" });
                }

                return Ok(new { 
                    message = "Entrega confirmada exitosamente",
                    pedido = pedido
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error confirming delivery: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtener pedidos por estado
        /// </summary>
        [HttpGet("estado/{estado}")]
        public async Task<IActionResult> GetPedidosByEstado(string estado)
        {
            try
            {
                var pedidos = await _pedidoBusiness.GetByEstadoAsync(estado);
                return Ok(pedidos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting pedidos by estado {estado}: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }

    // DTOs específicos para los endpoints
    public class ActualizarEstadoPedidoDto
    {
        public string Estado { get; set; } = string.Empty;
        public string? Notas { get; set; }
    }

    public class ConfirmarEntregaDto
    {
        public DateTime FechaEntrega { get; set; }
        public string? ReferenciaPago { get; set; }
    }
}

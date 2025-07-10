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
        private readonly ICarritoBusiness _carritoBusiness;

        public CarritoController(ICarritoBusiness business, ILogger<CarritoController> logger)
            : base(business, logger) 
        {
            _carritoBusiness = business;
        }

        protected override int GetEntityId(CarritoDto dto) => dto.Id;

        /// <summary>
        /// Obtener carrito por usuario
        /// </summary>
        [HttpGet("usuario/{usuarioId}")]
        public async Task<IActionResult> GetCarritoByUsuario(int usuarioId)
        {
            try
            {
                var carritos = await _carritoBusiness.GetAllAsync();
                var carrito = carritos.FirstOrDefault(c => c.UsuarioId == usuarioId);
                
                if (carrito == null)
                {
                    // Crear un carrito nuevo si no existe
                    var nuevoCarrito = new CarritoDto
                    {
                        Name = $"Carrito_{usuarioId}",
                        Description = "Carrito de compras",
                        UsuarioId = usuarioId,
                        Estado = "Activo",
                        Productos = new List<CarritoProductoDto>()
                    };
                    
                    carrito = await _carritoBusiness.CreateAsync(nuevoCarrito);
                }

                return Ok(carrito);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener carrito del usuario {usuarioId}: {ex.Message}");
                return StatusCode(500, "Error interno del servidor");
            }
        }
    }
}

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
        private readonly IProductoBusiness _productoBusiness;
        private readonly ISeccionBusiness _seccionBusiness;

        public ProductoController(IProductoBusiness business, ISeccionBusiness seccionBusiness, ILogger<ProductoController> logger)
            : base(business, logger) 
        {
            _productoBusiness = business;
            _seccionBusiness = seccionBusiness;
        }

        protected override int GetEntityId(ProductoDto dto) => dto.Id;

        [HttpGet]
        public override async Task<IActionResult> GetAll()
        {
            try
            {
                var productos = await _productoBusiness.GetAllAsync();
                var secciones = await _seccionBusiness.GetAllAsync();

                var productosConSeccion = productos.Select(p => 
                {
                    var seccion = secciones.FirstOrDefault(s => s.Id == p.SeccionId);
                    return new ProductoDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Precio = p.Precio,
                        Stock = p.Stock,
                        ImagenUrl = p.ImagenUrl,
                        SeccionId = p.SeccionId,
                        SeccionNombre = seccion?.Name ?? "Sin sección",
                        EsEncargo = p.EsEncargo,
                        Material = p.Material
                    };
                }).ToList();

                return Ok(productosConSeccion);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener productos: {ex.Message}");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        [HttpGet("{id}")]
        public override async Task<IActionResult> GetById(int id)
        {
            try
            {
                var producto = await _productoBusiness.GetByIdAsync(id);
                if (producto == null)
                    return NotFound($"Producto con ID {id} no encontrado");

                var secciones = await _seccionBusiness.GetAllAsync();
                var seccion = secciones.FirstOrDefault(s => s.Id == producto.SeccionId);

                var productoConSeccion = new ProductoDto
                {
                    Id = producto.Id,
                    Name = producto.Name,
                    Description = producto.Description,
                    Precio = producto.Precio,
                    Stock = producto.Stock,
                    ImagenUrl = producto.ImagenUrl,
                    SeccionId = producto.SeccionId,
                    SeccionNombre = seccion?.Name ?? "Sin sección",
                    EsEncargo = producto.EsEncargo,
                    Material = producto.Material
                };

                return Ok(productoConSeccion);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener producto con ID {id}: {ex.Message}");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        [HttpGet("categoria/{categoriaId}")]
        public async Task<IActionResult> GetByCategoria(int categoriaId)
        {
            try
            {
                var productos = await _productoBusiness.GetAllAsync();
                var productosFiltrados = productos.Where(p => p.SeccionId == categoriaId).ToList();

                return Ok(productosFiltrados);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener productos por categoría: {ex.Message}");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        [HttpGet("destacados")]
        public async Task<IActionResult> GetProductosDestacados()
        {
            try
            {
                var productos = await _productoBusiness.GetAllAsync();
                // Por ahora retornamos los primeros 8 productos
                var destacados = productos.Take(8).ToList();

                return Ok(destacados);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener productos destacados: {ex.Message}");
                return StatusCode(500, "Error interno del servidor");
            }
        }
    }
}

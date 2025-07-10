using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Entity.Context;
using Entity.Model;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SeedController> _logger;

        public SeedController(ApplicationDbContext context, ILogger<SeedController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("init")]
        public async Task<IActionResult> InitializeDatabase()
        {
            try
            {
                // Crear roles si no existen
                if (!await _context.Roles.AnyAsync())
                {
                    var roles = new List<Rol>
                    {
                        new Rol { Name = "Admin", Description = "Administrador del sistema" },
                        new Rol { Name = "Cliente", Description = "Cliente de la tienda" }
                    };

                    await _context.Roles.AddRangeAsync(roles);
                    await _context.SaveChangesAsync();
                }

                // Crear secciones si no existen
                if (!await _context.Secciones.AnyAsync())
                {
                    var secciones = new List<Seccion>
                    {
                        new Seccion { Name = "Aretes", Description = "Aretes y pendientes" },
                        new Seccion { Name = "Collares", Description = "Collares y cadenas" },
                        new Seccion { Name = "Pulseras", Description = "Pulseras y brazaletes" },
                        new Seccion { Name = "Anillos", Description = "Anillos de diferentes estilos" },
                        new Seccion { Name = "Bolsas", Description = "Bolsas y carteras" },
                        new Seccion { Name = "Relojes", Description = "Relojes para dama" },
                        new Seccion { Name = "Gafas", Description = "Gafas de sol" }
                    };

                    await _context.Secciones.AddRangeAsync(secciones);
                    await _context.SaveChangesAsync();
                }

                // Crear productos de ejemplo si no existen
                if (!await _context.Productos.AnyAsync())
                {
                    var secciones = await _context.Secciones.ToListAsync();
                    var productos = new List<Producto>();

                    // Aretes
                    var aretesSeccion = secciones.First(s => s.Name == "Aretes");
                    productos.AddRange(new[]
                    {
                        new Producto { Name = "Aretes Dorados Elegantes", Description = "Hermosos aretes dorados para ocasiones especiales", Precio = 45000, Stock = 15, ImagenUrl = "/images/aretes1.jpg", SeccionId = aretesSeccion.Id, Material = "Oro 18k" },
                        new Producto { Name = "Aretes de Perla", Description = "Clásicos aretes de perla natural", Precio = 35000, Stock = 20, ImagenUrl = "/images/aretes2.jpg", SeccionId = aretesSeccion.Id, Material = "Perla natural" },
                        new Producto { Name = "Aretes Largos Plateados", Description = "Aretes largos con diseño moderno", Precio = 25000, Stock = 12, ImagenUrl = "/images/aretes3.jpg", SeccionId = aretesSeccion.Id, Material = "Plata 925" }
                    });

                    // Collares
                    var collaresSeccion = secciones.First(s => s.Name == "Collares");
                    productos.AddRange(new[]
                    {
                        new Producto { Name = "Collar de Cadena Dorada", Description = "Collar elegante de cadena dorada", Precio = 65000, Stock = 10, ImagenUrl = "/images/collar1.jpg", SeccionId = collaresSeccion.Id, Material = "Oro 18k" },
                        new Producto { Name = "Collar con Dije de Corazón", Description = "Romantic collar con dije en forma de corazón", Precio = 40000, Stock = 18, ImagenUrl = "/images/collar2.jpg", SeccionId = collaresSeccion.Id, Material = "Plata 925" }
                    });

                    // Pulseras
                    var pulserasSeccion = secciones.First(s => s.Name == "Pulseras");
                    productos.AddRange(new[]
                    {
                        new Producto { Name = "Pulsera de Cadena Fina", Description = "Delicada pulsera de cadena", Precio = 30000, Stock = 25, ImagenUrl = "/images/pulsera1.jpg", SeccionId = pulserasSeccion.Id, Material = "Plata 925" },
                        new Producto { Name = "Pulsera con Charms", Description = "Pulsera decorativa con múltiples charms", Precio = 55000, Stock = 8, ImagenUrl = "/images/pulsera2.jpg", SeccionId = pulserasSeccion.Id, Material = "Acero inoxidable" }
                    });

                    // Anillos
                    var anillosSeccion = secciones.First(s => s.Name == "Anillos");
                    productos.AddRange(new[]
                    {
                        new Producto { Name = "Anillo de Compromiso", Description = "Hermoso anillo con piedra central", Precio = 180000, Stock = 5, ImagenUrl = "/images/anillo1.jpg", SeccionId = anillosSeccion.Id, Material = "Oro blanco 18k" },
                        new Producto { Name = "Anillo Solitario", Description = "Elegante anillo solitario", Precio = 120000, Stock = 7, ImagenUrl = "/images/anillo2.jpg", SeccionId = anillosSeccion.Id, Material = "Oro 18k" }
                    });

                    await _context.Productos.AddRangeAsync(productos);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Base de datos inicializada correctamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al inicializar la base de datos: {ex.Message}");
                return StatusCode(500, new { message = "Error al inicializar la base de datos", error = ex.Message });
            }
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetDatabaseStatus()
        {
            try
            {
                var status = new
                {
                    roles = await _context.Roles.CountAsync(),
                    secciones = await _context.Secciones.CountAsync(),
                    productos = await _context.Productos.CountAsync(),
                    usuarios = await _context.Usuarios.CountAsync()
                };

                return Ok(status);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener estado de la base de datos: {ex.Message}");
                return StatusCode(500, "Error interno del servidor");
            }
        }
    }
}

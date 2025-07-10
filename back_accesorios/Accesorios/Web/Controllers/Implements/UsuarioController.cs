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
        private readonly IUsuarioBusiness _usuarioBusiness;

        public UsuarioController(IUsuarioBusiness business, ILogger<UsuarioController> logger)
            : base(business, logger) 
        {
            _usuarioBusiness = business;
        }

        protected override int GetEntityId(UsuarioDto dto) => dto.Id;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var usuarios = await _usuarioBusiness.GetAllAsync();
                var usuario = usuarios.FirstOrDefault(u => u.Email == request.Email);

                if (usuario == null)
                {
                    return Unauthorized(new { message = "Email o contraseña incorrectos" });
                }

                // Aquí deberías verificar la contraseña hasheada
                // Por ahora usamos verificación simple
                if (usuario.PasswordHash != request.Password) // En producción usar BCrypt
                {
                    return Unauthorized(new { message = "Email o contraseña incorrectos" });
                }

                var response = new
                {
                    user = new
                    {
                        id = usuario.Id.ToString(),
                        name = usuario.Name,
                        email = usuario.Email,
                        phone = usuario.Telefono,
                        address = usuario.Direccion,
                        country = "Colombia", // Campo por defecto
                        city = "Bogotá", // Campo por defecto
                        createdAt = usuario.FechaRegistro
                    },
                    token = "fake-jwt-token" // En producción generar JWT real
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during login: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Verificar si el email ya existe
                var usuarios = await _usuarioBusiness.GetAllAsync();
                if (usuarios.Any(u => u.Email == request.Email))
                {
                    return BadRequest(new { message = "El email ya está registrado" });
                }

                var usuarioDto = new UsuarioDto
                {
                    Name = request.Name,
                    Email = request.Email,
                    PasswordHash = request.PasswordHash, // En producción hashear con BCrypt
                    Telefono = request.Telefono,
                    Direccion = request.Direccion,
                    FechaRegistro = DateTime.UtcNow,
                    RolId = request.RolId,
                    Activo = request.Activo
                };

                var nuevoUsuario = await _usuarioBusiness.CreateAsync(usuarioDto);

                var response = new
                {
                    user = new
                    {
                        id = nuevoUsuario.Id.ToString(),
                        name = nuevoUsuario.Name,
                        email = nuevoUsuario.Email,
                        phone = nuevoUsuario.Telefono,
                        address = nuevoUsuario.Direccion,
                        country = "Colombia",
                        city = "Bogotá",
                        createdAt = nuevoUsuario.FechaRegistro
                    },
                    token = "fake-jwt-token"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during registration: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public int RolId { get; set; }
        public bool Activo { get; set; }
    }
}

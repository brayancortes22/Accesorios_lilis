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
                // Crear LoginDto para usar el método de negocio
                var loginDto = new Entity.Dtos.LoginDto
                {
                    Email = request.Email,
                    Password = request.Password
                };

                // Usar el método de negocio que maneja la autenticación completa
                var loginResponse = await _usuarioBusiness.LoginAsync(loginDto);
                
                if (loginResponse == null)
                {
                    return Unauthorized(new { message = "Email o contraseña incorrectos" });
                }

                var response = new
                {
                    user = new
                    {
                        id = loginResponse.Usuario.Id.ToString(),
                        name = loginResponse.Usuario.Nombre,
                        email = loginResponse.Usuario.Email,
                        phone = loginResponse.Usuario.Telefono,
                        address = loginResponse.Usuario.Direccion,
                        country = "Colombia", // Campo por defecto
                        city = "Bogotá", // Campo por defecto
                        createdAt = loginResponse.Usuario.FechaCreacion
                    },
                    token = loginResponse.Token
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

                // Crear UsuarioCreateDto
                var usuarioCreateDto = new UsuarioCreateDto
                {
                    Nombre = request.Name,
                    Email = request.Email,
                    PasswordHash = request.PasswordHash, // RegisterAsync manejará el hash
                    Telefono = request.Telefono,
                    Direccion = request.Direccion,
                    RolId = request.RolId,
                    Activo = request.Activo
                };

                // Usar el método de negocio que maneja todo el proceso de registro
                var nuevoUsuario = await _usuarioBusiness.RegisterAsync(usuarioCreateDto);

                var response = new
                {
                    user = new
                    {
                        id = nuevoUsuario.Id.ToString(),
                        name = nuevoUsuario.Nombre,
                        email = nuevoUsuario.Email,
                        phone = nuevoUsuario.Telefono,
                        address = nuevoUsuario.Direccion,
                        country = "Colombia",
                        city = "Bogotá",
                        createdAt = nuevoUsuario.FechaCreacion
                    },
                    message = "Usuario registrado exitosamente"
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

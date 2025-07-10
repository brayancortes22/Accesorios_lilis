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

        /// <summary>
        /// Crear nuevo usuario (sobrescribe el método genérico para usar RegisterAsync)
        /// </summary>
        public override async Task<IActionResult> Create([FromBody] UsuarioDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // El problema: UsuarioDto no tiene PasswordHash
                // Necesitamos una forma de obtener la contraseña desde el request
                
                // Por ahora, usar una contraseña por defecto para testing
                var usuarioCreateDto = new UsuarioCreateDto
                {
                    Nombre = dto.Nombre,
                    Email = dto.Email,
                    PasswordHash = "password123", // TEMPORAL - deberíamos obtener esto del request
                    Telefono = dto.Telefono,
                    Direccion = dto.Direccion,
                    Ciudad = dto.Ciudad,
                    Pais = dto.Pais,
                    RolId = dto.RolId,
                    Activo = dto.Activo
                };

                // Usar RegisterAsync que maneja el hashing de contraseñas
                var usuarioCreado = await _usuarioBusiness.RegisterAsync(usuarioCreateDto);
                
                return CreatedAtAction(nameof(GetById), new { id = usuarioCreado.Id }, usuarioCreado);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError($"Error de validación al crear usuario: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al crear usuario: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Crear usuario con contraseña (endpoint de registro)
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UsuarioCreateDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Verificar si el email ya existe
                var usuarios = await _usuarioBusiness.GetAllAsync();
                if (usuarios.Any(u => u.Email == createDto.Email))
                {
                    return BadRequest(new { message = "El email ya está registrado" });
                }

                var usuarioCreado = await _usuarioBusiness.RegisterAsync(createDto);
                
                var response = new
                {
                    user = new
                    {
                        id = usuarioCreado.Id.ToString(),
                        name = usuarioCreado.Nombre,
                        email = usuarioCreado.Email,
                        phone = usuarioCreado.Telefono,
                        address = usuarioCreado.Direccion,
                        country = "Colombia",
                        city = "Bogotá",
                        createdAt = usuarioCreado.FechaCreacion
                    },
                    message = "Usuario registrado exitosamente"
                };

                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError($"Error de validación al crear usuario: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al crear usuario: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

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
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}

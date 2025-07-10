using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Web.Controllers.Interface;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase, IAuthController
    {
        private readonly IUsuarioBusiness _usuarioBusiness;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IUsuarioBusiness usuarioBusiness, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _usuarioBusiness = usuarioBusiness;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Entity.Dtos.LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

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
                        createdAt = loginResponse.Usuario.FechaCreacion,
                        rolId = loginResponse.Usuario.RolId,
                        role = loginResponse.Usuario.RolNombre ?? "Cliente"
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
        public async Task<IActionResult> Register([FromBody] Web.Controllers.Interface.RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Crear UsuarioCreateDto
                var usuarioCreateDto = new UsuarioCreateDto
                {
                    Nombre = registerDto.Nombre,
                    Email = registerDto.Email,
                    PasswordHash = registerDto.Password, // RegisterAsync manejará el hash
                    Telefono = registerDto.Telefono,
                    Direccion = registerDto.Direccion,
                    RolId = 2, // Cliente por defecto
                    Activo = true
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

        [HttpGet("current")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized();
                }

                var usuario = await _usuarioBusiness.GetByIdAsync(userId);
                if (usuario == null)
                {
                    return NotFound();
                }

                var response = new
                {
                    id = usuario.Id.ToString(),
                    name = usuario.Nombre,
                    email = usuario.Email,
                    phone = usuario.Telefono,
                    address = usuario.Direccion,
                    createdAt = usuario.FechaCreacion
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting current user: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        private string GenerateJwtToken(UsuarioDto usuario)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? "TuClaveSecretaSuperSeguraDeAlMenos32Caracteres123456");

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Name),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.RolNombre ?? "Cliente")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"] ?? "AccesoriosAPI",
                Audience = jwtSettings["Audience"] ?? "AccesoriosApp"
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private string HashPassword(string password)
        {
            // Por simplicidad, usamos un hash básico
            // En producción deberías usar BCrypt.Net-Next
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string hash)
        {
            // Verificar con BCrypt
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
    }
}

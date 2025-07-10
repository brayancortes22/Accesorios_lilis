using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;

namespace Web.Controllers.Implements
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
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
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                // Buscar usuario por email
                var usuarios = await _usuarioBusiness.GetAllAsync();
                var usuario = usuarios.FirstOrDefault(u => u.Email == loginDto.Email);

                if (usuario == null)
                {
                    return Unauthorized(new { message = "Email o contraseña incorrectos" });
                }

                // Verificar contraseña (aquí deberías usar BCrypt para verificar el hash)
                if (!VerifyPassword(loginDto.Password, usuario.PasswordHash))
                {
                    return Unauthorized(new { message = "Email o contraseña incorrectos" });
                }

                // Generar token JWT
                var token = GenerateJwtToken(usuario);

                var response = new
                {
                    user = new
                    {
                        id = usuario.Id.ToString(),
                        name = usuario.Name,
                        email = usuario.Email,
                        phone = usuario.Telefono,
                        address = usuario.Direccion,
                        createdAt = usuario.FechaRegistro
                    },
                    token = token
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
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                // Verificar si el email ya existe
                var usuarios = await _usuarioBusiness.GetAllAsync();
                if (usuarios.Any(u => u.Email == registerDto.Email))
                {
                    return BadRequest(new { message = "El email ya está registrado" });
                }

                // Crear nuevo usuario
                var usuarioDto = new UsuarioDto
                {
                    Name = registerDto.Nombre,
                    Description = "Usuario cliente",
                    Email = registerDto.Email,
                    PasswordHash = HashPassword(registerDto.Password),
                    Telefono = registerDto.Telefono,
                    Direccion = registerDto.Direccion,
                    FechaRegistro = DateTime.UtcNow,
                    RolId = 2, // Rol de cliente por defecto
                    Activo = true
                };

                var nuevoUsuario = await _usuarioBusiness.CreateAsync(usuarioDto);

                // Generar token JWT
                var token = GenerateJwtToken(nuevoUsuario);

                var response = new
                {
                    user = new
                    {
                        id = nuevoUsuario.Id.ToString(),
                        name = nuevoUsuario.Name,
                        email = nuevoUsuario.Email,
                        phone = nuevoUsuario.Telefono,
                        address = nuevoUsuario.Direccion,
                        createdAt = nuevoUsuario.FechaRegistro
                    },
                    token = token
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
                    name = usuario.Name,
                    email = usuario.Email,
                    phone = usuario.Telefono,
                    address = usuario.Direccion,
                    createdAt = usuario.FechaRegistro
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

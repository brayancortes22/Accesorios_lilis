using Microsoft.AspNetCore.Mvc;
using Entity.Dtos;

namespace Web.Controllers.Interface
{
    public interface IAuthController
    {
        /// <summary>
        /// Autentica un usuario con email y contraseña
        /// </summary>
        /// <param name="loginDto">Datos de login</param>
        /// <returns>Usuario autenticado con token JWT</returns>
        Task<IActionResult> Login([FromBody] LoginDto loginDto);

        /// <summary>
        /// Registra un nuevo usuario
        /// </summary>
        /// <param name="registerDto">Datos del usuario a registrar</param>
        /// <returns>Usuario registrado</returns>
        Task<IActionResult> Register([FromBody] RegisterDto registerDto);

        /// <summary>
        /// Obtiene los datos del usuario actual autenticado
        /// </summary>
        /// <returns>Datos del usuario actual</returns>
        Task<IActionResult> GetCurrentUser();
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

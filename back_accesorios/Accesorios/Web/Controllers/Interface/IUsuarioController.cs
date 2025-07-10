using Microsoft.AspNetCore.Mvc;
using Entity.Dtos;
using Entity.Model;

namespace Web.Controllers.Interface
{
    public interface IUsuarioController : IGenericController<UsuarioDto, Usuario>
    {
        /// <summary>
        /// Autentica un usuario (método legacy)
        /// </summary>
        /// <param name="request">Datos de login</param>
        /// <returns>Usuario autenticado</returns>
        Task<IActionResult> Login([FromBody] LoginRequest request);

        /// <summary>
        /// Registra un nuevo usuario (método legacy)
        /// </summary>
        /// <param name="request">Datos del usuario a registrar</param>
        /// <returns>Usuario registrado</returns>
        Task<IActionResult> Register([FromBody] RegisterRequest request);

        /// <summary>
        /// Obtiene un usuario por su email
        /// </summary>
        /// <param name="email">Email del usuario</param>
        /// <returns>Usuario encontrado</returns>
        Task<IActionResult> GetByEmail(string email);

        /// <summary>
        /// Cambiar contraseña de un usuario
        /// </summary>
        /// <param name="id">ID del usuario</param>
        /// <param name="request">Nueva contraseña</param>
        /// <returns>Resultado de la operación</returns>
        Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordRequest request);
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
        public int RolId { get; set; } = 2;
        public bool Activo { get; set; } = true;
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}

using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;

namespace Business.Interfaces
{
    public interface IUsuarioBusiness : IBaseBusiness<Usuario, UsuarioDto>
    {
        /// <summary>
        /// Autentica un usuario con email y contraseña
        /// </summary>
        /// <param name="loginDto">Datos de login</param>
        /// <returns>Respuesta de login con usuario y token</returns>
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);

        /// <summary>
        /// Registra un nuevo usuario
        /// </summary>
        /// <param name="usuarioCreateDto">Datos del usuario a registrar</param>
        /// <returns>Usuario registrado</returns>
        Task<UsuarioDto> RegisterAsync(UsuarioCreateDto usuarioCreateDto);

        /// <summary>
        /// Obtiene un usuario por su email
        /// </summary>
        /// <param name="email">Email del usuario</param>
        /// <returns>Usuario encontrado o null</returns>
        Task<UsuarioDto?> GetByEmailAsync(string email);

        /// <summary>
        /// Actualiza los datos de un usuario
        /// </summary>
        /// <param name="usuarioUpdateDto">Datos a actualizar</param>
        /// <returns>Usuario actualizado</returns>
        Task<UsuarioDto> UpdateUserAsync(UsuarioUpdateDto usuarioUpdateDto);

        /// <summary>
        /// Obtiene usuarios por rol
        /// </summary>
        /// <param name="rolId">ID del rol</param>
        /// <returns>Lista de usuarios del rol</returns>
        Task<List<UsuarioDto>> GetByRolAsync(int rolId);

        /// <summary>
        /// Obtiene usuarios activos
        /// </summary>
        /// <returns>Lista de usuarios activos</returns>
        Task<List<UsuarioDto>> GetActiveUsersAsync();

        /// <summary>
        /// Cambia la contraseña de un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <param name="nuevaPassword">Nueva contraseña</param>
        /// <returns>True si se cambió correctamente</returns>
        Task<bool> ChangePasswordAsync(int usuarioId, string nuevaPassword);

        /// <summary>
        /// Valida si el email es único
        /// </summary>
        /// <param name="email">Email a validar</param>
        /// <param name="excludeId">ID de usuario a excluir</param>
        /// <returns>True si es único</returns>
        Task<bool> IsEmailUniqueAsync(string email, int? excludeId = null);

        /// <summary>
        /// Obtiene usuarios por rol
        /// </summary>
        /// <param name="rolId">ID del rol</param>
        /// <returns>Lista de usuarios del rol</returns>
        Task<IEnumerable<UsuarioDto>> GetByRolIdAsync(int rolId);
    }
}

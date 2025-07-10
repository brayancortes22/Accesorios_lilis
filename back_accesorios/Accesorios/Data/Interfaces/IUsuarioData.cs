using Data.Interfaces;
using Entity.Model;

namespace Data.Interfaces
{
    public interface IUsuarioData : IBaseModelData<Usuario>
    {
        /// <summary>
        /// Obtiene un usuario por su email
        /// </summary>
        /// <param name="email">Email del usuario</param>
        /// <returns>Usuario encontrado o null</returns>
        Task<Usuario?> GetByEmailAsync(string email);

        /// <summary>
        /// Verifica si existe un usuario con el email especificado
        /// </summary>
        /// <param name="email">Email a verificar</param>
        /// <param name="excludeId">ID de usuario a excluir de la búsqueda (para actualizaciones)</param>
        /// <returns>True si existe, False si no</returns>
        Task<bool> ExistsByEmailAsync(string email, int? excludeId = null);

        /// <summary>
        /// Obtiene usuarios por rol
        /// </summary>
        /// <param name="rolId">ID del rol</param>
        /// <returns>Lista de usuarios del rol especificado</returns>
        Task<List<Usuario>> GetByRolAsync(int rolId);

        /// <summary>
        /// Obtiene usuarios activos
        /// </summary>
        /// <returns>Lista de usuarios activos</returns>
        Task<List<Usuario>> GetActiveUsersAsync();
    }
}

using Data.Interfaces;
using Entity.Model;

namespace Data.Interfaces
{
    public interface IRolData : IBaseModelData<Rol>
    {
        /// <summary>
        /// Obtiene un rol por su código
        /// </summary>
        /// <param name="codigo">Código del rol</param>
        /// <returns>Rol encontrado o null</returns>
        Task<Rol?> GetByCodigoAsync(string codigo);

        /// <summary>
        /// Verifica si existe un rol con el código especificado
        /// </summary>
        /// <param name="codigo">Código a verificar</param>
        /// <param name="excludeId">ID de rol a excluir de la búsqueda</param>
        /// <returns>True si existe, False si no</returns>
        Task<bool> ExistsByCodigoAsync(string codigo, int? excludeId = null);
    }
}

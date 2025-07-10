using Data.Interfaces;
using Entity.Model;

namespace Data.Interfaces
{
    public interface ISeccionData : IBaseModelData<Seccion>
    {
        /// <summary>
        /// Obtiene una sección por su código
        /// </summary>
        /// <param name="codigo">Código de la sección</param>
        /// <returns>Sección encontrada o null</returns>
        Task<Seccion?> GetByCodigoAsync(string codigo);

        /// <summary>
        /// Obtiene secciones ordenadas por el campo Orden
        /// </summary>
        /// <returns>Lista de secciones ordenadas</returns>
        Task<List<Seccion>> GetOrderedSectionsAsync();

        /// <summary>
        /// Obtiene secciones activas ordenadas
        /// </summary>
        /// <returns>Lista de secciones activas ordenadas</returns>
        Task<List<Seccion>> GetActiveSectionsAsync();

        /// <summary>
        /// Verifica si existe una sección con el código especificado
        /// </summary>
        /// <param name="codigo">Código a verificar</param>
        /// <param name="excludeId">ID de sección a excluir de la búsqueda</param>
        /// <returns>True si existe, False si no</returns>
        Task<bool> ExistsByCodigoAsync(string codigo, int? excludeId = null);
    }
}

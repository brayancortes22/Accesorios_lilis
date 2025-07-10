using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;

namespace Business.Interfaces
{
    public interface ISeccionBusiness : IBaseBusiness<Seccion, SeccionDto>
    {
        /// <summary>
        /// Obtiene una sección por su código
        /// </summary>
        /// <param name="codigo">Código de la sección</param>
        /// <returns>Sección encontrada</returns>
        Task<SeccionDto?> GetByCodigoAsync(string codigo);

        /// <summary>
        /// Obtiene secciones ordenadas
        /// </summary>
        /// <returns>Lista de secciones ordenadas</returns>
        Task<List<SeccionDto>> GetOrderedSectionsAsync();

        /// <summary>
        /// Obtiene secciones activas
        /// </summary>
        /// <returns>Lista de secciones activas</returns>
        Task<List<SeccionDto>> GetActiveSectionsAsync();

        /// <summary>
        /// Crea una nueva sección
        /// </summary>
        /// <param name="seccionCreateDto">Datos de la sección a crear</param>
        /// <returns>Sección creada</returns>
        Task<SeccionDto> CreateSectionAsync(SeccionCreateDto seccionCreateDto);

        /// <summary>
        /// Actualiza una sección
        /// </summary>
        /// <param name="seccionUpdateDto">Datos de la sección a actualizar</param>
        /// <returns>Sección actualizada</returns>
        Task<SeccionDto> UpdateSectionAsync(SeccionUpdateDto seccionUpdateDto);

        /// <summary>
        /// Valida si el código es único
        /// </summary>
        /// <param name="codigo">Código a validar</param>
        /// <param name="excludeId">ID de sección a excluir</param>
        /// <returns>True si es único</returns>
        Task<bool> IsCodigoUniqueAsync(string codigo, int? excludeId = null);

        /// <summary>
        /// Obtiene secciones activas (alias para compatibilidad)
        /// </summary>
        /// <returns>Lista de secciones activas</returns>
        Task<IEnumerable<SeccionDto>> GetActivasAsync();
    }
}

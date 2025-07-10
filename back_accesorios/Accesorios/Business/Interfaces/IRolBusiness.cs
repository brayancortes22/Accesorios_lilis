using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;

namespace Business.Interfaces
{
    public interface IRolBusiness : IBaseBusiness<Rol, RolDto>
    {
        /// <summary>
        /// Obtiene un rol por su código
        /// </summary>
        /// <param name="codigo">Código del rol</param>
        /// <returns>Rol encontrado</returns>
        Task<RolDto?> GetByCodigoAsync(string codigo);

        /// <summary>
        /// Crea un nuevo rol
        /// </summary>
        /// <param name="rolCreateDto">Datos del rol a crear</param>
        /// <returns>Rol creado</returns>
        Task<RolDto> CreateRoleAsync(RolCreateDto rolCreateDto);

        /// <summary>
        /// Actualiza un rol
        /// </summary>
        /// <param name="rolUpdateDto">Datos del rol a actualizar</param>
        /// <returns>Rol actualizado</returns>
        Task<RolDto> UpdateRoleAsync(RolUpdateDto rolUpdateDto);

        /// <summary>
        /// Valida si el código es único
        /// </summary>
        /// <param name="codigo">Código a validar</param>
        /// <param name="excludeId">ID de rol a excluir</param>
        /// <returns>True si es único</returns>
        Task<bool> IsCodigoUniqueAsync(string codigo, int? excludeId = null);

        /// <summary>
        /// Obtiene todos los roles activos
        /// </summary>
        /// <returns>Lista de roles activos</returns>
        Task<IEnumerable<RolDto>> GetActivosAsync();
    }
}

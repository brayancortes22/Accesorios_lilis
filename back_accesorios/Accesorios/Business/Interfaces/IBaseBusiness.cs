using System.Collections.Generic;
using System.Threading.Tasks;
using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Dtos.Base;
using Entity.Model.Base;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Business.Interfaces
{
    public interface IBaseBusiness<T, D> where T : BaseModel where D : BaseDto
       
    {
        /// <summary>
        /// Obtiene todas las entidades desde la base de datos.
        /// </summary>
        /// <returns>Una colecci�n de objetos de tipo <typeparamref name="D"/>.</returns>
        Task<List<D>> GetAllAsync();

        /// <summary>
        /// Obtiene todos los datos en forma de DTO.
        /// </summary>
        /// <returns>Una colecci�n de objetos de tipo <typeparamref name="D"/>.</returns>

        Task<D> GetByIdAsync(int id);

        /// <summary>
        /// Obtiene un DTO espec�fico por su ID.
        /// </summary>
        /// <param name="id">Identificador �nico del DTO.</param>
        /// <returns>Un objeto <typeparamref name="D"/> si se encuentra; de lo contrario, <c>null</c>.</returns>

        Task<D> CreateAsync(D dto);

        /// <summary>
        /// Actualiza un registro existente a partir de un DTO.
        /// </summary>
        /// <param name="D">Objeto de transferencia con los datos actualizados.</param>
        /// <returns>El DTO actualizado o una excepci�n si falla.</returns>
        Task<D> UpdateAsync(D dto);

        ///<summary>
        /// Elimina permanentemente un registro del sistema.
        ///</summary>
        ///<param name= "id">Identificador del registro a marcar como eliminado</param>
        ///<returns>True si la operaci�n fue exitosa; false en caso contrario </returns>
        Task<bool> DeleteAsync(int id);



        /// <summary>
        /// Elimina lógicamente un registro del sistema (cambio de estado a inactivo)
        /// </summary>
        /// <param name="id">Identificador del registro a desactivar</param>
        /// <returns>True si la operación fue exitosa; false en caso contrario</returns>
        Task<bool> SoftDeleteAsync(int id);
    }
}
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos.Base;
using Entity.Model.Base;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Business.Implements
{

    public abstract class ABaseBusiness<T, D> : IBaseBusiness<T, D> where T : BaseModel where D : BaseDto
    {


        /// <summary>
        /// Obtiene una colecci?n de todas las entidades del tipo especificado.
        /// </summary>
        /// <returns>
        /// Tarea asincrona que representa la operaci?n y contiene una colecci?n de entidades 
        /// cuando se completa correctamente.
        /// </returns>
        public abstract Task<List<D>> GetAllAsync();

        /// <summary>
        /// Recupera una entidad espec?fica por su identificador ?nico.
        /// </summary>
        /// <param name="id">Identificador ?nico de la entidad a recuperar.</param>
        /// <returns>
        /// Tarea asincrona que representa la operaci?n y contiene la entidad solicitada
        /// cuando se completa correctamente. Puede retornar null si no se encuentra la entidad.
        /// </returns>
        public abstract Task<D> GetByIdAsync(int id);

        /// <summary>
        /// Crea una nueva entidad en la fuente de datos.
        /// </summary>
        /// <param name="entity">Entidad a crear. No debe ser null.</param>
        /// <returns>
        /// Tarea asincrona que representa la operaci?n y contiene la entidad creada con sus
        /// valores actualizados (como el ID generado) cuando se completa correctamente.
        /// </returns>
        public abstract Task<D> CreateAsync(D dto);

        /// <summary>
        /// Actualiza una entidad existente en la fuente de datos.
        /// </summary>
        /// <param name="entity">Entidad con los valores actualizados. No debe ser null.</param>
        /// <returns>
        /// Tarea asincrona que representa la operaci?n y contiene la entidad actualizada
        /// cuando se completa correctamente.
        /// </returns>
        public abstract Task<D> UpdateAsync(D dto);

        /// <summary>
        /// Elimina una entidad de la fuente de datos por su identificador ?nico.
        /// </summary>
        /// <param name="id">Identificador ?nico de la entidad a eliminar.</param>
        /// <returns>
        /// Tarea asincrona que representa la operaci?n y contiene un valor booleano que indica
        /// si la eliminaci?n fue exitosa (true) o si la entidad no exist?a (false).
        /// </returns>
        public abstract Task<bool> DeleteAsync(int id);

        /// <summary>
        /// Elimina una entidad de manera logica de  la fuente de datos por su identificador ?nico.
        /// </summary>
        public abstract Task<bool> SoftDeleteAsync(int id);
    }
}
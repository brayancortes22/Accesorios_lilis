using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos.Base;
using Entity.Model.Base;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    /// <summary>
    /// Clase base que implementa la lógica de negocio común para operaciones CRUD genéricas.
    /// Proporciona implementaciones estándar para crear, leer, actualizar y eliminar entidades,
    /// incluyendo validación, mapeo automático entre DTOs y entidades, y logging.
    /// </summary>
    /// <typeparam name="T">Tipo de la entidad de dominio que representa el modelo de datos</typeparam>
    /// <typeparam name="D">Tipo del objeto de transferencia de datos (DTO) utilizado para comunicación con capas superiores</typeparam>
    public class BaseBusiness<T, D> : ABaseBusiness<T, D>
        where T : BaseModel
        where D : BaseDto
    {
        /// <summary>
        /// Instancia de AutoMapper para realizar el mapeo entre DTOs y entidades.
        /// </summary>
        protected readonly IMapper _mapper;

        /// <summary>
        /// Repositorio de datos para operaciones de persistencia de la entidad.
        /// </summary>
        protected readonly IBaseModelData<T> _data;

        /// <summary>
        /// Logger para registrar eventos, errores y operaciones de la clase.
        /// </summary>
        protected readonly ILogger _logger;


        /// <summary>
        /// Inicializa una nueva instancia de la clase BaseBusiness.
        /// </summary>
        /// <param name="data">Repositorio de datos para operaciones de persistencia</param>
        /// <param name="mapper">Instancia de AutoMapper para mapeo entre DTOs y entidades</param>
        /// <param name="logger">Logger para registrar eventos y errores durante las operaciones</param>
        public BaseBusiness(
            IBaseModelData<T> data,
            IMapper mapper,
            ILogger logger
         )
            : base()
        {
            _data = data ?? throw new ArgumentNullException(nameof(data));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Valida un DTO utilizando FluentValidation.
        /// </summary>
        /// <param name="dto">DTO a validar</param>
        /// <returns>Tarea que representa la validación asíncrona</returns>
        /// <exception cref="ArgumentException">Si la validación falla</exception>
     

        /// <inheritdoc />
        public override async Task<List<D>> GetAllAsync()
        {
            try
            {
                _logger.LogInformation($"Obteniendo todos los registros de {typeof(T).Name}");
                var entities = await _data.GetAllAsync();
                return _mapper.Map<IList<D>>(entities).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener registros de {typeof(T).Name}");
                throw;
            }
        }

        /// <inheritdoc />
        public override async Task<D> GetByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Obteniendo {typeof(T).Name} con ID: {id}");
                var entity = await _data.GetByIdAsync(id);
                return _mapper.Map<D>(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener {typeof(T).Name} con ID {id}");
                throw;
            }
        }

        /// <inheritdoc />
        public override async Task<D> CreateAsync(D dto)
        {
            try
            {
                var entity = _mapper.Map<T>(dto);
                entity = await _data.CreateAsync(entity);
                _logger.LogInformation($"Creando nuevo {typeof(T).Name}");
                return _mapper.Map<D>(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al crear {typeof(T).Name} desde DTO");
                throw;
            }
        }

        /// <inheritdoc />
        public override async Task<D> UpdateAsync(D dto)
        {
            try
            {
                var entity = _mapper.Map<T>(dto);
                entity = await _data.UpdateAsync(entity);
                _logger.LogInformation($"Actualizando {typeof(T).Name} desde DTO");
                return _mapper.Map<D>(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al actualizar {typeof(T).Name} desde DTO");
                throw;
            }
        }

        /// <inheritdoc />
        public override async Task<bool> DeleteAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Eliminando {typeof(T).Name} con ID: {id}");
                return await _data.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al eliminar {typeof(T).Name} con ID {id}");
                throw;
            }
        }

     
        public override async Task<bool> SoftDeleteAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Eliminando lógicamente {typeof(T).Name} con ID: {id}");
                return await _data.SoftDeleteAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al eliminar lógicamente {typeof(T).Name} con ID {id}");
                throw;
            }
        }

    }
}

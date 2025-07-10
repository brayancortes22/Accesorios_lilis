using Data.Interfaces;
using Entity.Model;

namespace Data.Interfaces
{
    public interface IWhatsappMensajeData : IBaseModelData<WhatsappMensaje>
    {
        /// <summary>
        /// Obtiene mensajes de un usuario específico
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Lista de mensajes del usuario</returns>
        Task<List<WhatsappMensaje>> GetByUsuarioAsync(int usuarioId);

        /// <summary>
        /// Obtiene mensajes por número de teléfono
        /// </summary>
        /// <param name="numeroTelefono">Número de teléfono</param>
        /// <returns>Lista de mensajes del número</returns>
        Task<List<WhatsappMensaje>> GetByPhoneNumberAsync(string numeroTelefono);

        /// <summary>
        /// Obtiene mensajes por estado
        /// </summary>
        /// <param name="estado">Estado del mensaje</param>
        /// <returns>Lista de mensajes en el estado especificado</returns>
        Task<List<WhatsappMensaje>> GetByEstadoAsync(string estado);

        /// <summary>
        /// Obtiene mensajes por tipo
        /// </summary>
        /// <param name="tipo">Tipo de mensaje</param>
        /// <returns>Lista de mensajes del tipo especificado</returns>
        Task<List<WhatsappMensaje>> GetByTipoAsync(string tipo);

        /// <summary>
        /// Obtiene mensajes pendientes de respuesta
        /// </summary>
        /// <returns>Lista de mensajes pendientes</returns>
        Task<List<WhatsappMensaje>> GetPendingMessagesAsync();

        /// <summary>
        /// Obtiene mensajes dentro de un rango de fechas
        /// </summary>
        /// <param name="fechaInicio">Fecha de inicio</param>
        /// <param name="fechaFin">Fecha de fin</param>
        /// <returns>Lista de mensajes en el rango especificado</returns>
        Task<List<WhatsappMensaje>> GetByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin);

        /// <summary>
        /// Marca un mensaje como leído
        /// </summary>
        /// <param name="mensajeId">ID del mensaje</param>
        /// <returns>True si se actualizó correctamente</returns>
        Task<bool> MarkAsReadAsync(int mensajeId);

        /// <summary>
        /// Marca un mensaje como respondido
        /// </summary>
        /// <param name="mensajeId">ID del mensaje</param>
        /// <returns>True si se actualizó correctamente</returns>
        Task<bool> MarkAsRespondedAsync(int mensajeId);

        /// <summary>
        /// Actualiza el estado de un mensaje
        /// </summary>
        /// <param name="mensajeId">ID del mensaje</param>
        /// <param name="nuevoEstado">Nuevo estado del mensaje</param>
        /// <returns>True si se actualizó correctamente</returns>
        Task<bool> UpdateEstadoAsync(int mensajeId, string nuevoEstado);

        /// <summary>
        /// Obtiene mensajes con información de usuario incluida
        /// </summary>
        /// <returns>Lista de mensajes con datos de usuario</returns>
        Task<List<WhatsappMensaje>> GetWithUserInfoAsync();
    }
}

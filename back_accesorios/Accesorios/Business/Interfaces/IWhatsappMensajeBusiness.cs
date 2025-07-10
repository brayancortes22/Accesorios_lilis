using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;

namespace Business.Interfaces
{
    public interface IWhatsappMensajeBusiness : IBaseBusiness<WhatsappMensaje, WhatsappMensajeDto>
    {
        /// <summary>
        /// Envía un nuevo mensaje de WhatsApp
        /// </summary>
        /// <param name="enviarMensajeDto">Datos del mensaje a enviar</param>
        /// <returns>Mensaje enviado</returns>
        Task<WhatsappMensajeDto> SendMessageAsync(EnviarMensajeWhatsappDto enviarMensajeDto);

        /// <summary>
        /// Obtiene mensajes de un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Lista de mensajes del usuario</returns>
        Task<List<WhatsappMensajeDto>> GetMessagesByUserAsync(int usuarioId);

        /// <summary>
        /// Obtiene mensajes por número de teléfono
        /// </summary>
        /// <param name="numeroTelefono">Número de teléfono</param>
        /// <returns>Lista de mensajes del número</returns>
        Task<List<WhatsappMensajeDto>> GetMessagesByPhoneAsync(string numeroTelefono);

        /// <summary>
        /// Obtiene mensajes por estado
        /// </summary>
        /// <param name="estado">Estado del mensaje</param>
        /// <returns>Lista de mensajes en el estado especificado</returns>
        Task<List<WhatsappMensajeDto>> GetMessagesByStatusAsync(string estado);

        /// <summary>
        /// Obtiene mensajes por tipo
        /// </summary>
        /// <param name="tipo">Tipo de mensaje</param>
        /// <returns>Lista de mensajes del tipo especificado</returns>
        Task<List<WhatsappMensajeDto>> GetMessagesByTypeAsync(string tipo);

        /// <summary>
        /// Obtiene mensajes pendientes de respuesta
        /// </summary>
        /// <returns>Lista de mensajes pendientes</returns>
        Task<List<WhatsappMensajeDto>> GetPendingMessagesAsync();

        /// <summary>
        /// Marca un mensaje como leído
        /// </summary>
        /// <param name="mensajeId">ID del mensaje</param>
        /// <returns>True si se marcó como leído</returns>
        Task<bool> MarkAsReadAsync(int mensajeId);

        /// <summary>
        /// Marca un mensaje como respondido
        /// </summary>
        /// <param name="mensajeId">ID del mensaje</param>
        /// <returns>True si se marcó como respondido</returns>
        Task<bool> MarkAsRespondedAsync(int mensajeId);

        /// <summary>
        /// Actualiza el estado de un mensaje
        /// </summary>
        /// <param name="whatsappMensajeUpdateDto">Datos de actualización</param>
        /// <returns>Mensaje actualizado</returns>
        Task<WhatsappMensajeDto> UpdateMessageStatusAsync(WhatsappMensajeUpdateDto whatsappMensajeUpdateDto);

        /// <summary>
        /// Obtiene mensajes dentro de un rango de fechas
        /// </summary>
        /// <param name="fechaInicio">Fecha de inicio</param>
        /// <param name="fechaFin">Fecha de fin</param>
        /// <returns>Lista de mensajes en el rango especificado</returns>
        Task<List<WhatsappMensajeDto>> GetMessagesByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin);
    }
}

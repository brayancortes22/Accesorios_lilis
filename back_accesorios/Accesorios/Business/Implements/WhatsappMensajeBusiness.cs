using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    public class WhatsappMensajeBusiness : BaseBusiness<WhatsappMensaje, WhatsappMensajeDto>, IWhatsappMensajeBusiness
    {
        private readonly IWhatsappMensajeData _whatsappMensajeData;

        public WhatsappMensajeBusiness(IWhatsappMensajeData data, IMapper mapper, ILogger<WhatsappMensajeBusiness> logger) : base(data, mapper, logger)
        {
            _whatsappMensajeData = data;
        }

        public async Task<WhatsappMensajeDto> SendMessageAsync(EnviarMensajeWhatsappDto enviarMensajeDto)
        {
            var mensaje = _mapper.Map<WhatsappMensaje>(enviarMensajeDto);
            mensaje.FechaEnvio = DateTime.UtcNow;
            mensaje.Estado = "Enviado";

            var createdMensaje = await _whatsappMensajeData.CreateAsync(mensaje);
            return _mapper.Map<WhatsappMensajeDto>(createdMensaje);
        }

        public async Task<List<WhatsappMensajeDto>> GetMessagesByUserAsync(int usuarioId)
        {
            var mensajes = await _whatsappMensajeData.GetByUsuarioAsync(usuarioId);
            return _mapper.Map<List<WhatsappMensajeDto>>(mensajes);
        }

        public async Task<List<WhatsappMensajeDto>> GetMessagesByPhoneAsync(string numeroTelefono)
        {
            var mensajes = await _whatsappMensajeData.GetByPhoneNumberAsync(numeroTelefono);
            return _mapper.Map<List<WhatsappMensajeDto>>(mensajes);
        }

        public async Task<List<WhatsappMensajeDto>> GetMessagesByStatusAsync(string estado)
        {
            var mensajes = await _whatsappMensajeData.GetByEstadoAsync(estado);
            return _mapper.Map<List<WhatsappMensajeDto>>(mensajes);
        }

        public async Task<List<WhatsappMensajeDto>> GetMessagesByTypeAsync(string tipo)
        {
            var mensajes = await _whatsappMensajeData.GetByTipoAsync(tipo);
            return _mapper.Map<List<WhatsappMensajeDto>>(mensajes);
        }

        public async Task<List<WhatsappMensajeDto>> GetPendingMessagesAsync()
        {
            var mensajes = await _whatsappMensajeData.GetPendingMessagesAsync();
            return _mapper.Map<List<WhatsappMensajeDto>>(mensajes);
        }

        public async Task<bool> MarkAsReadAsync(int mensajeId)
        {
            return await _whatsappMensajeData.MarkAsReadAsync(mensajeId);
        }

        public async Task<bool> MarkAsRespondedAsync(int mensajeId)
        {
            return await _whatsappMensajeData.MarkAsRespondedAsync(mensajeId);
        }

        public async Task<WhatsappMensajeDto> UpdateMessageStatusAsync(WhatsappMensajeUpdateDto whatsappMensajeUpdateDto)
        {
            await _whatsappMensajeData.UpdateEstadoAsync(whatsappMensajeUpdateDto.Id, whatsappMensajeUpdateDto.Estado);
            
            var updatedMensaje = await _whatsappMensajeData.GetByIdAsync(whatsappMensajeUpdateDto.Id);
            return _mapper.Map<WhatsappMensajeDto>(updatedMensaje);
        }

        public async Task<List<WhatsappMensajeDto>> GetMessagesByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin)
        {
            var mensajes = await _whatsappMensajeData.GetByDateRangeAsync(fechaInicio, fechaFin);
            return _mapper.Map<List<WhatsappMensajeDto>>(mensajes);
        }
    }
}

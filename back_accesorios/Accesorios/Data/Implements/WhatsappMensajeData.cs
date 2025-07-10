using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;
using Microsoft.EntityFrameworkCore;

namespace Data.Implements
{
    public class WhatsappMensajeData : BaseModelData<WhatsappMensaje>, IWhatsappMensajeData
    {
        public WhatsappMensajeData(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<WhatsappMensaje>> GetByUsuarioAsync(int usuarioId)
        {
            return await _dbSet
                .Include(w => w.Usuario)
                .Where(w => w.UsuarioId == usuarioId)
                .OrderByDescending(w => w.FechaEnvio)
                .ToListAsync();
        }

        public async Task<List<WhatsappMensaje>> GetByPhoneNumberAsync(string numeroTelefono)
        {
            return await _dbSet
                .Include(w => w.Usuario)
                .Where(w => w.NumeroTelefono == numeroTelefono)
                .OrderByDescending(w => w.FechaEnvio)
                .ToListAsync();
        }

        public async Task<List<WhatsappMensaje>> GetByEstadoAsync(string estado)
        {
            return await _dbSet
                .Include(w => w.Usuario)
                .Where(w => w.Estado == estado && w.Active)
                .OrderByDescending(w => w.FechaEnvio)
                .ToListAsync();
        }

        public async Task<List<WhatsappMensaje>> GetByTipoAsync(string tipo)
        {
            return await _dbSet
                .Include(w => w.Usuario)
                .Where(w => w.Tipo == tipo && w.Active)
                .OrderByDescending(w => w.FechaEnvio)
                .ToListAsync();
        }

        public async Task<List<WhatsappMensaje>> GetPendingMessagesAsync()
        {
            return await _dbSet
                .Include(w => w.Usuario)
                .Where(w => w.Estado == "Pendiente" && w.Active)
                .OrderBy(w => w.FechaEnvio)
                .ToListAsync();
        }

        public async Task<List<WhatsappMensaje>> GetByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin)
        {
            return await _dbSet
                .Include(w => w.Usuario)
                .Where(w => w.FechaEnvio >= fechaInicio && w.FechaEnvio <= fechaFin && w.Active)
                .OrderByDescending(w => w.FechaEnvio)
                .ToListAsync();
        }

        public async Task<bool> MarkAsReadAsync(int mensajeId)
        {
            var mensaje = await _dbSet.FindAsync(mensajeId);
            if (mensaje == null) return false;

            mensaje.Estado = "Leído";
            mensaje.FechaLectura = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkAsRespondedAsync(int mensajeId)
        {
            var mensaje = await _dbSet.FindAsync(mensajeId);
            if (mensaje == null) return false;

            mensaje.Estado = "Respondido";
            mensaje.FechaRespuesta = DateTime.UtcNow;
            
            // Si no tiene fecha de lectura, establecerla también
            if (!mensaje.FechaLectura.HasValue)
            {
                mensaje.FechaLectura = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateEstadoAsync(int mensajeId, string nuevoEstado)
        {
            var mensaje = await _dbSet.FindAsync(mensajeId);
            if (mensaje == null) return false;

            mensaje.Estado = nuevoEstado;

            // Establecer fechas correspondientes según el estado
            switch (nuevoEstado.ToLower())
            {
                case "leído":
                    if (!mensaje.FechaLectura.HasValue)
                        mensaje.FechaLectura = DateTime.UtcNow;
                    break;
                case "respondido":
                    if (!mensaje.FechaLectura.HasValue)
                        mensaje.FechaLectura = DateTime.UtcNow;
                    if (!mensaje.FechaRespuesta.HasValue)
                        mensaje.FechaRespuesta = DateTime.UtcNow;
                    break;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<WhatsappMensaje>> GetWithUserInfoAsync()
        {
            return await _dbSet
                .Include(w => w.Usuario)
                .OrderByDescending(w => w.FechaEnvio)
                .ToListAsync();
        }

        // Override para incluir información de usuario por defecto
        public override async Task<WhatsappMensaje> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(w => w.Usuario)
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        public override async Task<List<WhatsappMensaje>> GetAllAsync()
        {
            return await GetWithUserInfoAsync();
        }

        public override async Task<WhatsappMensaje> CreateAsync(WhatsappMensaje entity)
        {
            entity.FechaEnvio = DateTime.UtcNow;
            entity.Estado = "Pendiente";
            
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}

using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;
using Microsoft.EntityFrameworkCore;

namespace Data.Implements
{
    public class PedidoData : BaseModelData<Pedido>, IPedidoData
    {
        public PedidoData(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<Pedido>> GetByUsuarioAsync(int usuarioId)
        {
            return await _dbSet
                .Include(p => p.Usuario)
                .Where(p => p.UsuarioId == usuarioId)
                .OrderByDescending(p => p.FechaPedido)
                .ToListAsync();
        }

        public async Task<List<Pedido>> GetByEstadoAsync(string estado)
        {
            return await _dbSet
                .Include(p => p.Usuario)
                .Where(p => p.Estado == estado && p.Active)
                .OrderByDescending(p => p.FechaPedido)
                .ToListAsync();
        }

        public async Task<Pedido?> GetWithProductsAsync(int pedidoId)
        {
            return await _dbSet
                .Include(p => p.Usuario)
                .Include(p => p.PedidoProductos)
                    .ThenInclude(pp => pp.Producto)
                        .ThenInclude(pr => pr.Seccion)
                .FirstOrDefaultAsync(p => p.Id == pedidoId);
        }

        public async Task<List<Pedido>> GetWithUserInfoAsync()
        {
            return await _dbSet
                .Include(p => p.Usuario)
                .OrderByDescending(p => p.FechaPedido)
                .ToListAsync();
        }

        public async Task<List<Pedido>> GetByUsuarioWithProductsAsync(int usuarioId)
        {
            return await _dbSet
                .Include(p => p.Usuario)
                .Include(p => p.PedidoProductos)
                    .ThenInclude(pp => pp.Producto)
                        .ThenInclude(pr => pr.Seccion)
                .Where(p => p.UsuarioId == usuarioId)
                .OrderByDescending(p => p.FechaPedido)
                .ToListAsync();
        }

        public async Task<Pedido?> GetByNumeroAsync(string numero)
        {
            return await _dbSet
                .Include(p => p.Usuario)
                .FirstOrDefaultAsync(p => p.Numero == numero);
        }

        public async Task<bool> UpdateEstadoAsync(int pedidoId, string nuevoEstado)
        {
            var pedido = await _dbSet.FindAsync(pedidoId);
            if (pedido == null) return false;

            pedido.Estado = nuevoEstado;
            
            // Si se marca como entregado, establecer fecha de entrega
            if (nuevoEstado.ToLower() == "entregado" && !pedido.FechaEntrega.HasValue)
            {
                pedido.FechaEntrega = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> GenerateOrderNumberAsync()
        {
            var today = DateTime.Now;
            var prefix = $"PED{today:yyyyMMdd}";
            
            // Buscar el último número del día
            var lastOrder = await _dbSet
                .Where(p => p.Numero.StartsWith(prefix))
                .OrderByDescending(p => p.Numero)
                .FirstOrDefaultAsync();

            int nextNumber = 1;
            if (lastOrder != null)
            {
                // Extraer el número secuencial del último pedido
                var lastNumber = lastOrder.Numero.Substring(prefix.Length);
                if (int.TryParse(lastNumber, out int lastNum))
                {
                    nextNumber = lastNum + 1;
                }
            }

            return $"{prefix}{nextNumber:D3}"; // Formato: PED20250709001
        }

        public async Task<List<Pedido>> GetByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin)
        {
            return await _dbSet
                .Include(p => p.Usuario)
                .Where(p => p.FechaPedido >= fechaInicio && p.FechaPedido <= fechaFin && p.Active)
                .OrderByDescending(p => p.FechaPedido)
                .ToListAsync();
        }

        // Override para incluir información de usuario por defecto
        public override async Task<Pedido> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Usuario)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public override async Task<List<Pedido>> GetAllAsync()
        {
            return await GetWithUserInfoAsync();
        }

        public override async Task<Pedido> CreateAsync(Pedido entity)
        {
            // Generar número de pedido automáticamente si no existe
            if (string.IsNullOrEmpty(entity.Numero))
            {
                entity.Numero = await GenerateOrderNumberAsync();
            }

            entity.FechaPedido = DateTime.UtcNow;
            
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}

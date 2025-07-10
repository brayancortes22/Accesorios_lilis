using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;
using Microsoft.EntityFrameworkCore;

namespace Data.Implements
{
    public class PedidoProductoData : BaseModelData<PedidoProducto>, IPedidoProductoData
    {
        public PedidoProductoData(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<PedidoProducto>> GetByPedidoAsync(int pedidoId)
        {
            return await _dbSet
                .Where(pp => pp.PedidoId == pedidoId && pp.Active)
                .OrderBy(pp => pp.Id)
                .ToListAsync();
        }

        public async Task<List<PedidoProducto>> GetByPedidoWithProductInfoAsync(int pedidoId)
        {
            return await _dbSet
                .Include(pp => pp.Producto)
                    .ThenInclude(p => p.Seccion)
                .Where(pp => pp.PedidoId == pedidoId && pp.Active)
                .OrderBy(pp => pp.Id)
                .ToListAsync();
        }

        public async Task<PedidoProducto?> GetByPedidoAndProductoAsync(int pedidoId, int productoId)
        {
            return await _dbSet
                .Include(pp => pp.Producto)
                .FirstOrDefaultAsync(pp => pp.PedidoId == pedidoId && pp.ProductoId == productoId && pp.Active);
        }

        public async Task<decimal> CalculateOrderTotalAsync(int pedidoId)
        {
            return await _dbSet
                .Where(pp => pp.PedidoId == pedidoId && pp.Active)
                .SumAsync(pp => pp.Subtotal);
        }

        public async Task<int> GetTotalItemsAsync(int pedidoId)
        {
            return await _dbSet
                .Where(pp => pp.PedidoId == pedidoId && pp.Active)
                .SumAsync(pp => pp.Cantidad);
        }

        public async Task<List<PedidoProducto>> GetOrdersByProductAsync(int productoId)
        {
            return await _dbSet
                .Include(pp => pp.Pedido)
                    .ThenInclude(p => p.Usuario)
                .Include(pp => pp.Producto)
                .Where(pp => pp.ProductoId == productoId && pp.Active)
                .OrderByDescending(pp => pp.Pedido.FechaPedido)
                .ToListAsync();
        }

        // Override para incluir información del producto y pedido por defecto
        public override async Task<PedidoProducto> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(pp => pp.Pedido)
                    .ThenInclude(p => p.Usuario)
                .Include(pp => pp.Producto)
                    .ThenInclude(p => p.Seccion)
                .FirstOrDefaultAsync(pp => pp.Id == id);
        }

        public override async Task<PedidoProducto> CreateAsync(PedidoProducto entity)
        {
            // Calcular subtotal automáticamente
            entity.Subtotal = entity.PrecioUnitario * entity.Cantidad;
            
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public override async Task<PedidoProducto> UpdateAsync(PedidoProducto entity)
        {
            // Recalcular subtotal automáticamente
            entity.Subtotal = entity.PrecioUnitario * entity.Cantidad;
            
            _context.Set<PedidoProducto>().Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}

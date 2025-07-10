using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;
using Microsoft.EntityFrameworkCore;

namespace Data.Implements
{
    public class CarritoProductoData : BaseModelData<CarritoProducto>, ICarritoProductoData
    {
        public CarritoProductoData(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<CarritoProducto>> GetByCarritoAsync(int carritoId)
        {
            return await _dbSet
                .Where(cp => cp.CarritoId == carritoId && cp.Active)
                .OrderBy(cp => cp.FechaAgregado)
                .ToListAsync();
        }

        public async Task<List<CarritoProducto>> GetByCarritoWithProductInfoAsync(int carritoId)
        {
            return await _dbSet
                .Include(cp => cp.Producto)
                    .ThenInclude(p => p.Seccion)
                .Where(cp => cp.CarritoId == carritoId && cp.Active)
                .OrderBy(cp => cp.FechaAgregado)
                .ToListAsync();
        }

        public async Task<CarritoProducto?> GetByCarritoAndProductoAsync(int carritoId, int productoId)
        {
            return await _dbSet
                .Include(cp => cp.Producto)
                .FirstOrDefaultAsync(cp => cp.CarritoId == carritoId && cp.ProductoId == productoId && cp.Active);
        }

        public async Task<bool> UpdateQuantityAsync(int carritoProductoId, int nuevaCantidad)
        {
            var carritoProducto = await _dbSet.FindAsync(carritoProductoId);
            if (carritoProducto == null) return false;

            carritoProducto.Cantidad = nuevaCantidad;
            carritoProducto.Subtotal = carritoProducto.PrecioUnitario * nuevaCantidad;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int carritoId)
        {
            var productosCarrito = await _dbSet
                .Where(cp => cp.CarritoId == carritoId)
                .ToListAsync();

            _dbSet.RemoveRange(productosCarrito);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<decimal> CalculateCartTotalAsync(int carritoId)
        {
            return await _dbSet
                .Where(cp => cp.CarritoId == carritoId && cp.Active)
                .SumAsync(cp => cp.Subtotal);
        }

        public async Task<int> GetTotalItemsAsync(int carritoId)
        {
            return await _dbSet
                .Where(cp => cp.CarritoId == carritoId && cp.Active)
                .SumAsync(cp => cp.Cantidad);
        }

        // Override para incluir información del producto por defecto
        public override async Task<CarritoProducto> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(cp => cp.Carrito)
                .Include(cp => cp.Producto)
                    .ThenInclude(p => p.Seccion)
                .FirstOrDefaultAsync(cp => cp.Id == id);
        }

        public override async Task<CarritoProducto> CreateAsync(CarritoProducto entity)
        {
            // Calcular subtotal automáticamente
            entity.Subtotal = entity.PrecioUnitario * entity.Cantidad;
            entity.FechaAgregado = DateTime.UtcNow;
            
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public override async Task<CarritoProducto> UpdateAsync(CarritoProducto entity)
        {
            // Recalcular subtotal automáticamente
            entity.Subtotal = entity.PrecioUnitario * entity.Cantidad;
            
            _context.Set<CarritoProducto>().Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}

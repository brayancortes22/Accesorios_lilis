using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;
using Microsoft.EntityFrameworkCore;

namespace Data.Implements
{
    public class ProductoData : BaseModelData<Producto>, IProductoData
    {
        public ProductoData(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<List<Producto>> GetBySeccionAsync(int seccionId)
        {
            return await _dbSet
                .Include(p => p.Seccion)
                .Where(p => p.SeccionId == seccionId && p.Active)
                .OrderBy(p => p.Nombre)
                .ToListAsync();
        }

        public async Task<List<Producto>> GetFeaturedProductsAsync()
        {
            return await _dbSet
                .Include(p => p.Seccion)
                .Where(p => p.Destacado && p.Active)
                .OrderBy(p => p.Nombre)
                .ToListAsync();
        }

        public async Task<List<Producto>> GetInStockProductsAsync()
        {
            return await _dbSet
                .Include(p => p.Seccion)
                .Where(p => p.Stock > 0 && p.Active)
                .OrderBy(p => p.Nombre)
                .ToListAsync();
        }

        public async Task<List<Producto>> SearchByNameAsync(string nombre)
        {
            return await _dbSet
                .Include(p => p.Seccion)
                .Where(p => p.Nombre.ToLower().Contains(nombre.ToLower()) && p.Active)
                .OrderBy(p => p.Nombre)
                .ToListAsync();
        }

        public async Task<List<Producto>> GetWithSectionInfoAsync()
        {
            return await _dbSet
                .Include(p => p.Seccion)
                .OrderBy(p => p.Seccion.Orden)
                .ThenBy(p => p.Nombre)
                .ToListAsync();
        }

        public async Task<List<Producto>> GetActiveWithSectionInfoAsync()
        {
            return await _dbSet
                .Include(p => p.Seccion)
                .Where(p => p.Active)
                .OrderBy(p => p.Seccion.Orden)
                .ThenBy(p => p.Nombre)
                .ToListAsync();
        }

        public async Task<bool> UpdateStockAsync(int productoId, int nuevoStock)
        {
            var producto = await _dbSet.FindAsync(productoId);
            if (producto == null) return false;

            producto.Stock = nuevoStock;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ReduceStockAsync(int productoId, int cantidad)
        {
            var producto = await _dbSet.FindAsync(productoId);
            if (producto == null || producto.Stock < cantidad) return false;

            producto.Stock -= cantidad;
            await _context.SaveChangesAsync();
            return true;
        }

        // Override para incluir información de sección por defecto
        public override async Task<Producto> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Seccion)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public override async Task<List<Producto>> GetAllAsync()
        {
            return await GetActiveWithSectionInfoAsync();
        }
    }
}

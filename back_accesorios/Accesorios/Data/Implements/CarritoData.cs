using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;
using Microsoft.EntityFrameworkCore;

namespace Data.Implements
{
    public class CarritoData : BaseModelData<Carrito>, ICarritoData
    {
        public CarritoData(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Carrito?> GetActiveCartByUserAsync(int usuarioId)
        {
            return await _dbSet
                .Include(c => c.Usuario)
                .FirstOrDefaultAsync(c => c.UsuarioId == usuarioId && c.Estado == "Activo" && c.Active);
        }

        public async Task<Carrito?> GetWithProductsAsync(int carritoId)
        {
            return await _dbSet
                .Include(c => c.Usuario)
                .Include(c => c.CarritoProductos)
                    .ThenInclude(cp => cp.Producto)
                        .ThenInclude(p => p.Seccion)
                .FirstOrDefaultAsync(c => c.Id == carritoId);
        }

        public async Task<Carrito?> GetActiveCartWithProductsAsync(int usuarioId)
        {
            return await _dbSet
                .Include(c => c.Usuario)
                .Include(c => c.CarritoProductos.Where(cp => cp.Active))
                    .ThenInclude(cp => cp.Producto)
                        .ThenInclude(p => p.Seccion)
                .FirstOrDefaultAsync(c => c.UsuarioId == usuarioId && c.Estado == "Activo" && c.Active);
        }

        public async Task<Carrito> CreateCartForUserAsync(int usuarioId)
        {
            var carrito = new Carrito
            {
                Name = "Carrito",
                Description = "Carrito de compras",
                UsuarioId = usuarioId,
                Estado = "Activo",
                FechaCreacion = DateTime.UtcNow,
                Active = true
            };

            await _dbSet.AddAsync(carrito);
            await _context.SaveChangesAsync();
            return carrito;
        }

        public async Task<bool> UpdateCartStatusAsync(int carritoId, string nuevoEstado)
        {
            var carrito = await _dbSet.FindAsync(carritoId);
            if (carrito == null) return false;

            carrito.Estado = nuevoEstado;
            carrito.FechaActualizacion = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Carrito>> GetByStatusAsync(string estado)
        {
            return await _dbSet
                .Include(c => c.Usuario)
                .Where(c => c.Estado == estado && c.Active)
                .OrderByDescending(c => c.FechaCreacion)
                .ToListAsync();
        }

        // Override para incluir información de usuario por defecto
        public override async Task<Carrito> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(c => c.Usuario)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public override async Task<List<Carrito>> GetAllAsync()
        {
            return await _dbSet
                .Include(c => c.Usuario)
                .OrderByDescending(c => c.FechaCreacion)
                .ToListAsync();
        }
    }
}

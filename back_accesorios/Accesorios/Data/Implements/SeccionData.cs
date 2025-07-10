using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;
using Microsoft.EntityFrameworkCore;

namespace Data.Implements
{
    public class SeccionData : BaseModelData<Seccion>, ISeccionData
    {
        public SeccionData(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Seccion?> GetByCodigoAsync(string codigo)
        {
            return await _dbSet
                .FirstOrDefaultAsync(s => s.Codigo.ToLower() == codigo.ToLower());
        }

        public async Task<List<Seccion>> GetOrderedSectionsAsync()
        {
            return await _dbSet
                .OrderBy(s => s.Orden)
                .ThenBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<List<Seccion>> GetActiveSectionsAsync()
        {
            return await _dbSet
                .Where(s => s.Active)
                .OrderBy(s => s.Orden)
                .ThenBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<bool> ExistsByCodigoAsync(string codigo, int? excludeId = null)
        {
            var query = _dbSet.Where(s => s.Codigo.ToLower() == codigo.ToLower());
            
            if (excludeId.HasValue)
            {
                query = query.Where(s => s.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public override async Task<List<Seccion>> GetAllAsync()
        {
            return await GetOrderedSectionsAsync();
        }
    }
}

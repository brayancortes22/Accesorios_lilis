using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;
using Microsoft.EntityFrameworkCore;

namespace Data.Implements
{
    public class RolData : BaseModelData<Rol>, IRolData
    {
        public RolData(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Rol?> GetByCodigoAsync(string codigo)
        {
            return await _dbSet
                .FirstOrDefaultAsync(r => r.Codigo.ToLower() == codigo.ToLower());
        }

        public async Task<bool> ExistsByCodigoAsync(string codigo, int? excludeId = null)
        {
            var query = _dbSet.Where(r => r.Codigo.ToLower() == codigo.ToLower());
            
            if (excludeId.HasValue)
            {
                query = query.Where(r => r.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public override async Task<List<Rol>> GetAllAsync()
        {
            return await _dbSet
                .OrderBy(r => r.Name)
                .ToListAsync();
        }
    }
}

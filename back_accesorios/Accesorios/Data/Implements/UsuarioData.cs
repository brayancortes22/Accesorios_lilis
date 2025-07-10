using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;
using Microsoft.EntityFrameworkCore;

namespace Data.Implements
{
    public class UsuarioData : BaseModelData<Usuario>, IUsuarioData
    {
        public UsuarioData(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Usuario?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<bool> ExistsByEmailAsync(string email, int? excludeId = null)
        {
            var query = _dbSet.Where(u => u.Email.ToLower() == email.ToLower());
            
            if (excludeId.HasValue)
            {
                query = query.Where(u => u.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task<List<Usuario>> GetByRolAsync(int rolId)
        {
            return await _dbSet
                .Include(u => u.Rol)
                .Where(u => u.RolId == rolId)
                .ToListAsync();
        }

        public async Task<List<Usuario>> GetActiveUsersAsync()
        {
            return await _dbSet
                .Include(u => u.Rol)
                .Where(u => u.Active)
                .OrderBy(u => u.Nombre)
                .ToListAsync();
        }

        // Override para incluir información del rol por defecto
        public override async Task<Usuario> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public override async Task<List<Usuario>> GetAllAsync()
        {
            return await _dbSet
                .Include(u => u.Rol)
                .OrderBy(u => u.Nombre)
                .ToListAsync();
        }
    }
}

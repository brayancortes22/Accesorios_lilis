using Data.Interfaces;
using Entity.Model.Base;
using Entity.Context;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace Data.Implements.BaseData
{

    /// <summary>
    /// Clase abstracta para poder sobre escribir métodos e incluir nuevos metodos sin cambiar la Interfaz
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class ABaseModelData<T> : IBaseModelData<T> where T : BaseModel
    {
    
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        protected ABaseModelData(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        // Métodos abstractos que deben ser implementados por las clases derivadas
        public abstract Task<List<T>> GetAllAsync();
        public abstract Task<T> GetByIdAsync(int id);
        public abstract Task<T> CreateAsync(T entity);
        public abstract Task<T> UpdateAsync(T entity);
        public abstract Task<bool> DeleteAsync(int id);
        public abstract Task<bool> SoftDeleteAsync(int id);

    }
}

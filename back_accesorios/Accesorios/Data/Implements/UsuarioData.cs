using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;

namespace Data.Implements
{
    public class UsuarioData : BaseModelData<Usuario>, IUsuarioData
    {
        public UsuarioData(ApplicationDbContext context) : base(context) { }
        // Métodos personalizados para Usuario (si se requieren en el futuro)
    }
}

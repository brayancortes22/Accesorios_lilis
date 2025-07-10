using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;

namespace Data.Implements
{
    public class RolData : BaseModelData<Rol>, IRolData
    {
        public RolData(ApplicationDbContext context) : base(context) { }
    }
}

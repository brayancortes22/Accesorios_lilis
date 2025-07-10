using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;

namespace Data.Implements
{
    public class SeccionData : BaseModelData<Seccion>, ISeccionData
    {
        public SeccionData(ApplicationDbContext context) : base(context) { }
    }
}

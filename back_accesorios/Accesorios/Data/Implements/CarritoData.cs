using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;

namespace Data.Implements
{
    public class CarritoData : BaseModelData<Carrito>, ICarritoData
    {
        public CarritoData(ApplicationDbContext context) : base(context) { }
    }
}

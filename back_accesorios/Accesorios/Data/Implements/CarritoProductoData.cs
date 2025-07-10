using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;

namespace Data.Implements
{
    public class CarritoProductoData : BaseModelData<CarritoProducto>, ICarritoProductoData
    {
        public CarritoProductoData(ApplicationDbContext context) : base(context) { }
    }
}

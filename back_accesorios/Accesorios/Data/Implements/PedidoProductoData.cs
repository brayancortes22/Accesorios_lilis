using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;

namespace Data.Implements
{
    public class PedidoProductoData : BaseModelData<PedidoProducto>, IPedidoProductoData
    {
        public PedidoProductoData(ApplicationDbContext context) : base(context) { }
    }
}

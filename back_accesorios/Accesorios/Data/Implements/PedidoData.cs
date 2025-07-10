using Data.Implements.BaseData;
using Data.Interfaces;
using Entity.Context;
using Entity.Model;

namespace Data.Implements
{
    public class PedidoData : BaseModelData<Pedido>, IPedidoData
    {
        public PedidoData(ApplicationDbContext context) : base(context) { }
    }
}

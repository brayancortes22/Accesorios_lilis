using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    public class PedidoProductoBusiness : BaseBusiness<PedidoProducto, PedidoProductoDto>, IPedidoProductoBusiness
    {
        public PedidoProductoBusiness(IPedidoProductoData data, IMapper mapper, ILogger<PedidoProductoBusiness> logger)
            : base(data, mapper, logger) { }
    }
}

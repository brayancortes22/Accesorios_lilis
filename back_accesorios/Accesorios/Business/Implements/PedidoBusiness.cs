using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    public class PedidoBusiness : BaseBusiness<Pedido, PedidoDto>, IPedidoBusiness
    {
        public PedidoBusiness(IPedidoData data, IMapper mapper, ILogger<PedidoBusiness> logger)
            : base(data, mapper, logger) { }
    }
}

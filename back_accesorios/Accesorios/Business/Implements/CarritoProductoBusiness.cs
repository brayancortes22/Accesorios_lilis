using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    public class CarritoProductoBusiness : BaseBusiness<CarritoProducto, CarritoProductoDto>, ICarritoProductoBusiness
    {
        public CarritoProductoBusiness(ICarritoProductoData data, IMapper mapper, ILogger<CarritoProductoBusiness> logger)
            : base(data, mapper, logger) { }
    }
}

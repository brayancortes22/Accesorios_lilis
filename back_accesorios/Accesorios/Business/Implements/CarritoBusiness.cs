using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    public class CarritoBusiness : BaseBusiness<Carrito, CarritoDto>, ICarritoBusiness
    {
        public CarritoBusiness(ICarritoData data, IMapper mapper, ILogger<CarritoBusiness> logger)
            : base(data, mapper, logger) { }
    }
}

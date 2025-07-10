using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class CarritoProfile : Profile
    {
        public CarritoProfile()
        {
            CreateMap<Carrito, CarritoDto>().ReverseMap();
        }
    }
}

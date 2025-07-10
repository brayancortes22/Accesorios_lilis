using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class CarritoProductoProfile : Profile
    {
        public CarritoProductoProfile()
        {
            CreateMap<CarritoProducto, CarritoProductoDto>()
                .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto.Name)).ReverseMap();
        }
    }
}

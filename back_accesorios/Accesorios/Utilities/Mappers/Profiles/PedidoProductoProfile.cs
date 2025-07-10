using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class PedidoProductoProfile : Profile
    {
        public PedidoProductoProfile()
        {
            CreateMap<PedidoProducto, PedidoProductoDto>()
                .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Producto.Name)).ReverseMap();
        }
    }
}

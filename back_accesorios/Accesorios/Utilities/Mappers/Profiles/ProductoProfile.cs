using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class ProductoProfile : Profile
    {
        public ProductoProfile()
        {
            // Producto <-> ProductoDto (bidireccional)
            CreateMap<Producto, ProductoDto>()
                .ForMember(dest => dest.SeccionNombre, opt => opt.MapFrom(src => src.Seccion.Name))
                .ForMember(dest => dest.Activo, opt => opt.MapFrom(src => src.Active))
                .ReverseMap()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.Seccion, opt => opt.Ignore()); // Ignoramos la navegación

            // ProductoCreateDto -> Producto
            CreateMap<ProductoCreateDto, Producto>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.FechaCreacion, opt => opt.MapFrom(src => DateTime.UtcNow));

            // ProductoUpdateDto -> Producto
            CreateMap<ProductoUpdateDto, Producto>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo));

            // Producto -> ProductoListDto
            CreateMap<Producto, ProductoListDto>()
                .ForMember(dest => dest.SeccionNombre, opt => opt.MapFrom(src => src.Seccion.Name))
                .ForMember(dest => dest.Activo, opt => opt.MapFrom(src => src.Active));
        }
    }
}

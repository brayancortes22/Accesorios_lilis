using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class SeccionProfile : Profile
    {
        public SeccionProfile()
        {
            // Seccion <-> SeccionDto (bidireccional)
            CreateMap<Seccion, SeccionDto>()
                .ForMember(dest => dest.Activo, opt => opt.MapFrom(src => src.Active))
                .ForMember(dest => dest.CantidadProductos, opt => opt.MapFrom(src => src.Productos.Count(p => p.Active)))
                .ReverseMap()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.Productos, opt => opt.Ignore()); // Ignoramos la colección

            // SeccionCreateDto -> Seccion
            CreateMap<SeccionCreateDto, Seccion>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo));

            // SeccionUpdateDto -> Seccion
            CreateMap<SeccionUpdateDto, Seccion>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo));
        }
    }
}

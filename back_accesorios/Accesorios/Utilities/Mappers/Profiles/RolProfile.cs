using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class RolProfile : Profile
    {
        public RolProfile()
        {
            // Rol <-> RolDto (bidireccional)
            CreateMap<Rol, RolDto>()
                .ForMember(dest => dest.Activo, opt => opt.MapFrom(src => src.Active))
                .ReverseMap()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo));

            // RolCreateDto -> Rol
            CreateMap<RolCreateDto, Rol>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo));

            // RolUpdateDto -> Rol
            CreateMap<RolUpdateDto, Rol>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo));
        }
    }
}

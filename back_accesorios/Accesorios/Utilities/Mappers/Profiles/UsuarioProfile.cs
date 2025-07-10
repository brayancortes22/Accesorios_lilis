using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class UsuarioProfile : Profile
    {
        public UsuarioProfile()
        {
            CreateMap<Usuario, UsuarioDto>()
                .ForMember(dest => dest.RolNombre, opt => opt.MapFrom(src => src.Rol.Name)).ReverseMap();
        }
    }
}

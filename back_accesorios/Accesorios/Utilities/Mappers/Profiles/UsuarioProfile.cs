using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class UsuarioProfile : Profile
    {
        public UsuarioProfile()
        {
            // Usuario <-> UsuarioDto (bidireccional)
            CreateMap<Usuario, UsuarioDto>()
                .ForMember(dest => dest.RolNombre, opt => opt.MapFrom(src => src.Rol.Name))
                .ForMember(dest => dest.Activo, opt => opt.MapFrom(src => src.Active))
                .ReverseMap()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.Rol, opt => opt.Ignore()) // Ignoramos la navegación
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()); // No mapeamos contraseña en reverso

            // UsuarioCreateDto -> Usuario
            CreateMap<UsuarioCreateDto, Usuario>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo))
                .ForMember(dest => dest.FechaCreacion, opt => opt.MapFrom(src => DateTime.UtcNow));

            // UsuarioUpdateDto -> Usuario
            CreateMap<UsuarioUpdateDto, Usuario>()
                .ForMember(dest => dest.Active, opt => opt.MapFrom(src => src.Activo));
        }
    }
}

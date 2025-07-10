using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class RolProfile : Profile
    {
        public RolProfile()
        {
            CreateMap<Rol, RolDto>().ReverseMap();
        }
    }
}

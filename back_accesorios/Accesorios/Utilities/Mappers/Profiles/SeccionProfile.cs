using AutoMapper;
using Entity.Model;
using Entity.Dtos;

namespace Utilities.Mappers.Profiles
{
    public class SeccionProfile : Profile
    {
        public SeccionProfile()
        {
            CreateMap<Seccion, SeccionDto>().ReverseMap();
        }
    }
}

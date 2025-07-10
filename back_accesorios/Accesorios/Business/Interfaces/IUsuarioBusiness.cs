using Entity.Model;
using Entity.Dtos;
using Business.Interfaces;

namespace Business.Interfaces
{
    public interface IUsuarioBusiness : IBaseBusiness<Usuario, UsuarioDto>
    {
        Task<UsuarioDto> CreateAsync(UsuarioDto dto);
        Task<UsuarioDto> UpdateAsync(UsuarioDto dto);
    }
}

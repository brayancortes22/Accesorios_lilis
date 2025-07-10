using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;
using BCrypt.Net;

namespace Business.Implements
{
    public class UsuarioBusiness : BaseBusiness<Usuario, UsuarioDto>, IUsuarioBusiness
    {
        public UsuarioBusiness(IUsuarioData data, IMapper mapper, ILogger<UsuarioBusiness> logger)
            : base(data, mapper, logger) { }

        public override async Task<UsuarioDto> CreateAsync(UsuarioDto dto)
        {
            if (!string.IsNullOrWhiteSpace(dto.PasswordHash))
            {
                dto.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.PasswordHash);
            }
            return await base.CreateAsync(dto);
        }

        public override async Task<UsuarioDto> UpdateAsync(UsuarioDto dto)
        {
            if (!string.IsNullOrWhiteSpace(dto.PasswordHash))
            {
                dto.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.PasswordHash);
            }
            return await base.UpdateAsync(dto);
        }
    }
}

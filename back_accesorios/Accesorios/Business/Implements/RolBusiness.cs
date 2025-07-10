using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    public class RolBusiness : BaseBusiness<Rol, RolDto>, IRolBusiness
    {
        private readonly IRolData _rolData;

        public RolBusiness(IRolData data, IMapper mapper, ILogger<RolBusiness> logger) : base(data, mapper, logger)
        {
            _rolData = data;
        }

        public async Task<RolDto?> GetByCodigoAsync(string codigo)
        {
            var rol = await _rolData.GetByCodigoAsync(codigo);
            return _mapper.Map<RolDto>(rol);
        }

        public async Task<RolDto> CreateRoleAsync(RolCreateDto rolCreateDto)
        {
            var rol = _mapper.Map<Rol>(rolCreateDto);
            var createdRol = await _rolData.CreateAsync(rol);
            return _mapper.Map<RolDto>(createdRol);
        }

        public async Task<RolDto> UpdateRoleAsync(RolUpdateDto rolUpdateDto)
        {
            var rol = await _rolData.GetByIdAsync(rolUpdateDto.Id);
            if (rol == null)
                throw new ArgumentException("Rol no encontrado");

            _mapper.Map(rolUpdateDto, rol);
            var updatedRol = await _rolData.UpdateAsync(rol);
            return _mapper.Map<RolDto>(updatedRol);
        }

        public async Task<bool> IsCodigoUniqueAsync(string codigo, int? excludeId = null)
        {
            var exists = await _rolData.ExistsByCodigoAsync(codigo, excludeId);
            return !exists; // Si existe, no es único
        }
    }
}


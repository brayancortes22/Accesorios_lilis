using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    public class SeccionBusiness : BaseBusiness<Seccion, SeccionDto>, ISeccionBusiness
    {
        private readonly ISeccionData _seccionData;

        public SeccionBusiness(ISeccionData data, IMapper mapper, ILogger<SeccionBusiness> logger) : base(data, mapper, logger)
        {
            _seccionData = data;
        }

        public async Task<SeccionDto?> GetByCodigoAsync(string codigo)
        {
            var seccion = await _seccionData.GetByCodigoAsync(codigo);
            return _mapper.Map<SeccionDto>(seccion);
        }

        public async Task<List<SeccionDto>> GetOrderedSectionsAsync()
        {
            var secciones = await _seccionData.GetOrderedSectionsAsync();
            return _mapper.Map<List<SeccionDto>>(secciones);
        }

        public async Task<List<SeccionDto>> GetActiveSectionsAsync()
        {
            var secciones = await _seccionData.GetActiveSectionsAsync();
            return _mapper.Map<List<SeccionDto>>(secciones);
        }

        public async Task<SeccionDto> CreateSectionAsync(SeccionCreateDto seccionCreateDto)
        {
            var seccion = _mapper.Map<Seccion>(seccionCreateDto);
            var createdSeccion = await _seccionData.CreateAsync(seccion);
            return _mapper.Map<SeccionDto>(createdSeccion);
        }

        public async Task<SeccionDto> UpdateSectionAsync(SeccionUpdateDto seccionUpdateDto)
        {
            var seccion = await _seccionData.GetByIdAsync(seccionUpdateDto.Id);
            if (seccion == null)
                throw new ArgumentException("Sección no encontrada");

            _mapper.Map(seccionUpdateDto, seccion);
            var updatedSeccion = await _seccionData.UpdateAsync(seccion);
            return _mapper.Map<SeccionDto>(updatedSeccion);
        }

        public async Task<bool> IsCodigoUniqueAsync(string codigo, int? excludeId = null)
        {
            var exists = await _seccionData.ExistsByCodigoAsync(codigo, excludeId);
            return !exists; // Si existe, no es único
        }
    }
}

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
        public SeccionBusiness(ISeccionData data, IMapper mapper, ILogger<SeccionBusiness> logger)
            : base(data, mapper, logger) { }
    }
}

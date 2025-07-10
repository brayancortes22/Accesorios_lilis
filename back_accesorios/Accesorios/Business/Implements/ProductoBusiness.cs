using AutoMapper;
using Business.Interfaces;
using Data.Interfaces;
using Entity.Dtos;
using Entity.Model;
using Microsoft.Extensions.Logging;

namespace Business.Implements
{
    public class ProductoBusiness : BaseBusiness<Producto, ProductoDto>, IProductoBusiness
    {
        public ProductoBusiness(IProductoData data, IMapper mapper, ILogger<ProductoBusiness> logger)
            : base(data, mapper, logger) { }
    }
}

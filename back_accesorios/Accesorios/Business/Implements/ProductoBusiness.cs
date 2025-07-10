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
        private readonly IProductoData _productoData;

        public ProductoBusiness(IProductoData data, IMapper mapper, ILogger<ProductoBusiness> logger) : base(data, mapper, logger)
        {
            _productoData = data;
        }

        public async Task<List<ProductoDto>> GetBySeccionAsync(int seccionId)
        {
            var productos = await _productoData.GetBySeccionAsync(seccionId);
            return _mapper.Map<List<ProductoDto>>(productos);
        }

        public async Task<List<ProductoDto>> GetFeaturedProductsAsync()
        {
            var productos = await _productoData.GetFeaturedProductsAsync();
            return _mapper.Map<List<ProductoDto>>(productos);
        }

        public async Task<List<ProductoDto>> GetInStockProductsAsync()
        {
            var productos = await _productoData.GetInStockProductsAsync();
            return _mapper.Map<List<ProductoDto>>(productos);
        }

        public async Task<List<ProductoDto>> SearchByNameAsync(string nombre)
        {
            var productos = await _productoData.SearchByNameAsync(nombre);
            return _mapper.Map<List<ProductoDto>>(productos);
        }

        public async Task<ProductoDto> CreateProductAsync(ProductoCreateDto productoCreateDto)
        {
            var producto = _mapper.Map<Producto>(productoCreateDto);
            var createdProducto = await _productoData.CreateAsync(producto);
            return _mapper.Map<ProductoDto>(createdProducto);
        }

        public async Task<ProductoDto> UpdateProductAsync(ProductoUpdateDto productoUpdateDto)
        {
            var producto = await _productoData.GetByIdAsync(productoUpdateDto.Id);
            if (producto == null)
                throw new ArgumentException("Producto no encontrado");

            _mapper.Map(productoUpdateDto, producto);
            var updatedProducto = await _productoData.UpdateAsync(producto);
            return _mapper.Map<ProductoDto>(updatedProducto);
        }

        public async Task<bool> UpdateStockAsync(int productoId, int nuevoStock)
        {
            return await _productoData.UpdateStockAsync(productoId, nuevoStock);
        }

        public async Task<bool> ReduceStockAsync(int productoId, int cantidad)
        {
            return await _productoData.ReduceStockAsync(productoId, cantidad);
        }

        public async Task<List<ProductoListDto>> GetActiveProductsAsync()
        {
            var productos = await _productoData.GetAllAsync();
            var productosActivos = productos.Where(p => p.Active == true).ToList();
            return _mapper.Map<List<ProductoListDto>>(productosActivos);
        }

        public async Task<IEnumerable<ProductoDto>> GetBySeccionIdAsync(int seccionId)
        {
            var productos = await _productoData.GetAllAsync();
            var productosPorSeccion = productos.Where(p => p.SeccionId == seccionId);
            return _mapper.Map<IEnumerable<ProductoDto>>(productosPorSeccion);
        }
    }
}

using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;

namespace Business.Interfaces
{
    public interface IProductoBusiness : IBaseBusiness<Producto, ProductoDto>
    {
        /// <summary>
        /// Obtiene productos por sección
        /// </summary>
        /// <param name="seccionId">ID de la sección</param>
        /// <returns>Lista de productos de la sección</returns>
        Task<List<ProductoDto>> GetBySeccionAsync(int seccionId);

        /// <summary>
        /// Obtiene productos destacados
        /// </summary>
        /// <returns>Lista de productos destacados</returns>
        Task<List<ProductoDto>> GetFeaturedProductsAsync();

        /// <summary>
        /// Obtiene productos en stock
        /// </summary>
        /// <returns>Lista de productos con stock disponible</returns>
        Task<List<ProductoDto>> GetInStockProductsAsync();

        /// <summary>
        /// Busca productos por nombre
        /// </summary>
        /// <param name="nombre">Nombre o parte del nombre a buscar</param>
        /// <returns>Lista de productos que coinciden con la búsqueda</returns>
        Task<List<ProductoDto>> SearchByNameAsync(string nombre);

        /// <summary>
        /// Crea un producto nuevo
        /// </summary>
        /// <param name="productoCreateDto">Datos del producto a crear</param>
        /// <returns>Producto creado</returns>
        Task<ProductoDto> CreateProductAsync(ProductoCreateDto productoCreateDto);

        /// <summary>
        /// Actualiza un producto
        /// </summary>
        /// <param name="productoUpdateDto">Datos del producto a actualizar</param>
        /// <returns>Producto actualizado</returns>
        Task<ProductoDto> UpdateProductAsync(ProductoUpdateDto productoUpdateDto);

        /// <summary>
        /// Actualiza el stock de un producto
        /// </summary>
        /// <param name="productoId">ID del producto</param>
        /// <param name="nuevoStock">Nuevo valor de stock</param>
        /// <returns>True si se actualizó correctamente</returns>
        Task<bool> UpdateStockAsync(int productoId, int nuevoStock);

        /// <summary>
        /// Reduce el stock de un producto (para ventas)
        /// </summary>
        /// <param name="productoId">ID del producto</param>
        /// <param name="cantidad">Cantidad a reducir</param>
        /// <returns>True si se actualizó correctamente</returns>
        Task<bool> ReduceStockAsync(int productoId, int cantidad);

        /// <summary>
        /// Obtiene productos activos con información de sección
        /// </summary>
        /// <returns>Lista de productos activos</returns>
        Task<List<ProductoListDto>> GetActiveProductsAsync();
    }
}

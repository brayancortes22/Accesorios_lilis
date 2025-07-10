using Data.Interfaces;
using Entity.Model;

namespace Data.Interfaces
{
    public interface IProductoData : IBaseModelData<Producto>
    {
        /// <summary>
        /// Obtiene productos por sección
        /// </summary>
        /// <param name="seccionId">ID de la sección</param>
        /// <returns>Lista de productos de la sección</returns>
        Task<List<Producto>> GetBySeccionAsync(int seccionId);

        /// <summary>
        /// Obtiene productos destacados
        /// </summary>
        /// <returns>Lista de productos destacados</returns>
        Task<List<Producto>> GetFeaturedProductsAsync();

        /// <summary>
        /// Obtiene productos en stock
        /// </summary>
        /// <returns>Lista de productos con stock disponible</returns>
        Task<List<Producto>> GetInStockProductsAsync();

        /// <summary>
        /// Busca productos por nombre
        /// </summary>
        /// <param name="nombre">Nombre o parte del nombre a buscar</param>
        /// <returns>Lista de productos que coinciden con la búsqueda</returns>
        Task<List<Producto>> SearchByNameAsync(string nombre);

        /// <summary>
        /// Obtiene productos con información de sección incluida
        /// </summary>
        /// <returns>Lista de productos con datos de sección</returns>
        Task<List<Producto>> GetWithSectionInfoAsync();

        /// <summary>
        /// Obtiene productos activos con información de sección
        /// </summary>
        /// <returns>Lista de productos activos con datos de sección</returns>
        Task<List<Producto>> GetActiveWithSectionInfoAsync();

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
    }
}

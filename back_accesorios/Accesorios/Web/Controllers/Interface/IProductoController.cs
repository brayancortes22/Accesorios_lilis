using Microsoft.AspNetCore.Mvc;
using Entity.Dtos;
using Entity.Model;

namespace Web.Controllers.Interface
{
    public interface IProductoController : IGenericController<ProductoDto, Producto>
    {
        /// <summary>
        /// Obtiene productos por sección
        /// </summary>
        /// <param name="seccionId">ID de la sección</param>
        /// <returns>Lista de productos de la sección</returns>
        Task<IActionResult> GetBySeccion(int seccionId);

        /// <summary>
        /// Busca productos por nombre o descripción
        /// </summary>
        /// <param name="searchTerm">Término de búsqueda</param>
        /// <returns>Lista de productos que coinciden con la búsqueda</returns>
        Task<IActionResult> Search(string searchTerm);

        /// <summary>
        /// Obtiene productos destacados
        /// </summary>
        /// <returns>Lista de productos destacados</returns>
        Task<IActionResult> GetFeatured();

        /// <summary>
        /// Obtiene productos con descuento
        /// </summary>
        /// <returns>Lista de productos con descuento</returns>
        Task<IActionResult> GetDiscounted();

        /// <summary>
        /// Filtra productos por rango de precio
        /// </summary>
        /// <param name="minPrice">Precio mínimo</param>
        /// <param name="maxPrice">Precio máximo</param>
        /// <returns>Lista de productos en el rango de precio</returns>
        Task<IActionResult> GetByPriceRange(decimal minPrice, decimal maxPrice);

        /// <summary>
        /// Actualiza el stock de un producto
        /// </summary>
        /// <param name="id">ID del producto</param>
        /// <param name="request">Nueva cantidad de stock</param>
        /// <returns>Producto actualizado</returns>
        Task<IActionResult> UpdateStock(int id, [FromBody] UpdateStockRequest request);
    }

    public class UpdateStockRequest
    {
        public int Stock { get; set; }
    }
}

using Microsoft.AspNetCore.Mvc;
using Entity.Dtos;
using Entity.Model;

namespace Web.Controllers.Interface
{
    public interface ISeccionController : IGenericController<SeccionDto, Seccion>
    {
        /// <summary>
        /// Obtiene todas las secciones activas
        /// </summary>
        /// <returns>Lista de secciones activas</returns>
        Task<IActionResult> GetActive();

        /// <summary>
        /// Obtiene secciones con productos
        /// </summary>
        /// <returns>Lista de secciones que tienen productos</returns>
        Task<IActionResult> GetWithProducts();

        /// <summary>
        /// Obtiene una sección con sus productos
        /// </summary>
        /// <param name="id">ID de la sección</param>
        /// <returns>Sección con sus productos</returns>
        Task<IActionResult> GetWithProductsById(int id);

        /// <summary>
        /// Obtiene el conteo de productos por sección
        /// </summary>
        /// <param name="id">ID de la sección</param>
        /// <returns>Cantidad de productos en la sección</returns>
        Task<IActionResult> GetProductCount(int id);

        /// <summary>
        /// Busca secciones por nombre
        /// </summary>
        /// <param name="searchTerm">Término de búsqueda</param>
        /// <returns>Lista de secciones que coinciden con la búsqueda</returns>
        Task<IActionResult> Search(string searchTerm);

        /// <summary>
        /// Obtiene las secciones más populares (con más productos)
        /// </summary>
        /// <param name="limit">Número de secciones a retornar</param>
        /// <returns>Lista de secciones más populares</returns>
        Task<IActionResult> GetMostPopular(int limit = 5);
    }
}

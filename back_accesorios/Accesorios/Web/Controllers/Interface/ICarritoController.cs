using Microsoft.AspNetCore.Mvc;
using Entity.Dtos;
using Entity.Model;

namespace Web.Controllers.Interface
{
    public interface ICarritoController : IGenericController<CarritoDto, Carrito>
    {
        /// <summary>
        /// Obtiene el carrito del usuario actual
        /// </summary>
        /// <returns>Carrito del usuario</returns>
        Task<IActionResult> GetMyCart();

        /// <summary>
        /// Obtiene un carrito por ID de usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Carrito del usuario</returns>
        Task<IActionResult> GetByUsuario(int usuarioId);

        /// <summary>
        /// Agrega un producto al carrito
        /// </summary>
        /// <param name="request">Datos del producto a agregar</param>
        /// <returns>Carrito actualizado</returns>
        Task<IActionResult> AddProduct([FromBody] AgregarProductoCarritoDto request);

        /// <summary>
        /// Actualiza la cantidad de un producto en el carrito
        /// </summary>
        /// <param name="carritoProductoId">ID del CarritoProducto</param>
        /// <param name="request">Nueva cantidad</param>
        /// <returns>Carrito actualizado</returns>
        Task<IActionResult> UpdateProductQuantity(int carritoProductoId, [FromBody] CarritoProductoUpdateDto request);

        /// <summary>
        /// Elimina un producto del carrito
        /// </summary>
        /// <param name="carritoProductoId">ID del CarritoProducto</param>
        /// <returns>Carrito actualizado</returns>
        Task<IActionResult> RemoveProduct(int carritoProductoId);

        /// <summary>
        /// Vacía el carrito del usuario
        /// </summary>
        /// <returns>Resultado de la operación</returns>
        Task<IActionResult> ClearCart();

        /// <summary>
        /// Obtiene el total del carrito
        /// </summary>
        /// <returns>Total del carrito</returns>
        Task<IActionResult> GetTotal();

        /// <summary>
        /// Obtiene la cantidad total de productos en el carrito
        /// </summary>
        /// <returns>Cantidad de productos</returns>
        Task<IActionResult> GetItemCount();
    }
}

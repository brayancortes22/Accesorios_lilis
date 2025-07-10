using Data.Interfaces;
using Entity.Model;

namespace Data.Interfaces
{
    public interface ICarritoProductoData : IBaseModelData<CarritoProducto>
    {
        /// <summary>
        /// Obtiene productos de un carrito específico
        /// </summary>
        /// <param name="carritoId">ID del carrito</param>
        /// <returns>Lista de productos en el carrito</returns>
        Task<List<CarritoProducto>> GetByCarritoAsync(int carritoId);

        /// <summary>
        /// Obtiene productos de un carrito con información del producto incluida
        /// </summary>
        /// <param name="carritoId">ID del carrito</param>
        /// <returns>Lista de productos en el carrito con información completa</returns>
        Task<List<CarritoProducto>> GetByCarritoWithProductInfoAsync(int carritoId);

        /// <summary>
        /// Obtiene un producto específico de un carrito
        /// </summary>
        /// <param name="carritoId">ID del carrito</param>
        /// <param name="productoId">ID del producto</param>
        /// <returns>CarritoProducto encontrado o null</returns>
        Task<CarritoProducto?> GetByCarritoAndProductoAsync(int carritoId, int productoId);

        /// <summary>
        /// Actualiza la cantidad de un producto en el carrito
        /// </summary>
        /// <param name="carritoProductoId">ID del registro CarritoProducto</param>
        /// <param name="nuevaCantidad">Nueva cantidad</param>
        /// <returns>True si se actualizó correctamente</returns>
        Task<bool> UpdateQuantityAsync(int carritoProductoId, int nuevaCantidad);

        /// <summary>
        /// Elimina todos los productos de un carrito
        /// </summary>
        /// <param name="carritoId">ID del carrito</param>
        /// <returns>True si se eliminaron correctamente</returns>
        Task<bool> ClearCartAsync(int carritoId);

        /// <summary>
        /// Calcula el total de un carrito
        /// </summary>
        /// <param name="carritoId">ID del carrito</param>
        /// <returns>Total del carrito</returns>
        Task<decimal> CalculateCartTotalAsync(int carritoId);

        /// <summary>
        /// Obtiene la cantidad total de productos en un carrito
        /// </summary>
        /// <param name="carritoId">ID del carrito</param>
        /// <returns>Cantidad total de productos</returns>
        Task<int> GetTotalItemsAsync(int carritoId);
    }
}

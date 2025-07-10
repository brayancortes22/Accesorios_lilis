using Data.Interfaces;
using Entity.Model;

namespace Data.Interfaces
{
    public interface IPedidoProductoData : IBaseModelData<PedidoProducto>
    {
        /// <summary>
        /// Obtiene productos de un pedido específico
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <returns>Lista de productos en el pedido</returns>
        Task<List<PedidoProducto>> GetByPedidoAsync(int pedidoId);

        /// <summary>
        /// Obtiene productos de un pedido con información del producto incluida
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <returns>Lista de productos en el pedido con información completa</returns>
        Task<List<PedidoProducto>> GetByPedidoWithProductInfoAsync(int pedidoId);

        /// <summary>
        /// Obtiene un producto específico de un pedido
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <param name="productoId">ID del producto</param>
        /// <returns>PedidoProducto encontrado o null</returns>
        Task<PedidoProducto?> GetByPedidoAndProductoAsync(int pedidoId, int productoId);

        /// <summary>
        /// Calcula el total de un pedido
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <returns>Total del pedido</returns>
        Task<decimal> CalculateOrderTotalAsync(int pedidoId);

        /// <summary>
        /// Obtiene la cantidad total de productos en un pedido
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <returns>Cantidad total de productos</returns>
        Task<int> GetTotalItemsAsync(int pedidoId);

        /// <summary>
        /// Obtiene pedidos que contienen un producto específico
        /// </summary>
        /// <param name="productoId">ID del producto</param>
        /// <returns>Lista de pedidos que contienen el producto</returns>
        Task<List<PedidoProducto>> GetOrdersByProductAsync(int productoId);
    }
}

using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;

namespace Business.Interfaces
{
    public interface ICarritoBusiness : IBaseBusiness<Carrito, CarritoDto>
    {
        /// <summary>
        /// Obtiene o crea el carrito activo de un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Carrito activo del usuario</returns>
        Task<CarritoDto> GetOrCreateActiveCartAsync(int usuarioId);

        /// <summary>
        /// Agrega un producto al carrito
        /// </summary>
        /// <param name="agregarProductoDto">Datos del producto a agregar</param>
        /// <returns>Producto agregado al carrito</returns>
        Task<CarritoProductoDto> AddProductToCartAsync(AgregarProductoCarritoDto agregarProductoDto);

        /// <summary>
        /// Actualiza la cantidad de un producto en el carrito
        /// </summary>
        /// <param name="carritoProductoUpdateDto">Datos de actualización</param>
        /// <returns>Producto actualizado</returns>
        Task<CarritoProductoDto> UpdateCartItemQuantityAsync(CarritoProductoUpdateDto carritoProductoUpdateDto);

        /// <summary>
        /// Elimina un producto del carrito
        /// </summary>
        /// <param name="carritoProductoId">ID del producto en el carrito</param>
        /// <returns>True si se eliminó correctamente</returns>
        Task<bool> RemoveProductFromCartAsync(int carritoProductoId);

        /// <summary>
        /// Vacía completamente un carrito
        /// </summary>
        /// <param name="carritoId">ID del carrito</param>
        /// <returns>True si se vació correctamente</returns>
        Task<bool> ClearCartAsync(int carritoId);

        /// <summary>
        /// Obtiene el carrito activo de un usuario con productos
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Carrito con productos incluidos</returns>
        Task<CarritoDto> GetActiveCartWithProductsAsync(int usuarioId);

        /// <summary>
        /// Convierte un carrito en pedido
        /// </summary>
        /// <param name="crearPedidoDto">Datos para crear el pedido</param>
        /// <returns>Pedido creado</returns>
        Task<PedidoDto> ConvertCartToOrderAsync(CrearPedidoDesdeCarritoDto crearPedidoDto);

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
        Task<int> GetCartItemCountAsync(int carritoId);
    }
}

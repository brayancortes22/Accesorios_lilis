using Data.Interfaces;
using Entity.Model;

namespace Data.Interfaces
{
    public interface ICarritoData : IBaseModelData<Carrito>
    {
        /// <summary>
        /// Obtiene el carrito activo de un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Carrito activo del usuario o null</returns>
        Task<Carrito?> GetActiveCartByUserAsync(int usuarioId);

        /// <summary>
        /// Obtiene carrito con productos incluidos
        /// </summary>
        /// <param name="carritoId">ID del carrito</param>
        /// <returns>Carrito con productos cargados</returns>
        Task<Carrito?> GetWithProductsAsync(int carritoId);

        /// <summary>
        /// Obtiene carrito activo del usuario con productos incluidos
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Carrito activo con productos cargados</returns>
        Task<Carrito?> GetActiveCartWithProductsAsync(int usuarioId);

        /// <summary>
        /// Crea un carrito para un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Carrito creado</returns>
        Task<Carrito> CreateCartForUserAsync(int usuarioId);

        /// <summary>
        /// Cambia el estado de un carrito
        /// </summary>
        /// <param name="carritoId">ID del carrito</param>
        /// <param name="nuevoEstado">Nuevo estado del carrito</param>
        /// <returns>True si se actualizó correctamente</returns>
        Task<bool> UpdateCartStatusAsync(int carritoId, string nuevoEstado);

        /// <summary>
        /// Obtiene carritos por estado
        /// </summary>
        /// <param name="estado">Estado del carrito</param>
        /// <returns>Lista de carritos en el estado especificado</returns>
        Task<List<Carrito>> GetByStatusAsync(string estado);
    }
}

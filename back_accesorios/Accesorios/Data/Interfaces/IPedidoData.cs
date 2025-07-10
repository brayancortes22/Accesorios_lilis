using Data.Interfaces;
using Entity.Model;

namespace Data.Interfaces
{
    public interface IPedidoData : IBaseModelData<Pedido>
    {
        /// <summary>
        /// Obtiene pedidos de un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Lista de pedidos del usuario</returns>
        Task<List<Pedido>> GetByUsuarioAsync(int usuarioId);

        /// <summary>
        /// Obtiene pedidos por estado
        /// </summary>
        /// <param name="estado">Estado del pedido</param>
        /// <returns>Lista de pedidos en el estado especificado</returns>
        Task<List<Pedido>> GetByEstadoAsync(string estado);

        /// <summary>
        /// Obtiene un pedido con productos incluidos
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <returns>Pedido con productos cargados</returns>
        Task<Pedido?> GetWithProductsAsync(int pedidoId);

        /// <summary>
        /// Obtiene pedidos con información de usuario incluida
        /// </summary>
        /// <returns>Lista de pedidos con datos de usuario</returns>
        Task<List<Pedido>> GetWithUserInfoAsync();

        /// <summary>
        /// Obtiene pedidos de un usuario con productos incluidos
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Lista de pedidos del usuario con productos</returns>
        Task<List<Pedido>> GetByUsuarioWithProductsAsync(int usuarioId);

        /// <summary>
        /// Obtiene un pedido por su número
        /// </summary>
        /// <param name="numero">Número del pedido</param>
        /// <returns>Pedido encontrado o null</returns>
        Task<Pedido?> GetByNumeroAsync(string numero);

        /// <summary>
        /// Actualiza el estado de un pedido
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <param name="nuevoEstado">Nuevo estado del pedido</param>
        /// <returns>True si se actualizó correctamente</returns>
        Task<bool> UpdateEstadoAsync(int pedidoId, string nuevoEstado);

        /// <summary>
        /// Genera un número único para el pedido
        /// </summary>
        /// <returns>Número único de pedido</returns>
        Task<string> GenerateOrderNumberAsync();

        /// <summary>
        /// Obtiene pedidos dentro de un rango de fechas
        /// </summary>
        /// <param name="fechaInicio">Fecha de inicio</param>
        /// <param name="fechaFin">Fecha de fin</param>
        /// <returns>Lista de pedidos en el rango especificado</returns>
        Task<List<Pedido>> GetByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin);
    }
}

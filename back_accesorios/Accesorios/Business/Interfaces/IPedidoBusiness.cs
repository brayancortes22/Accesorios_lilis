using Business.Interfaces;
using Entity.Dtos;
using Entity.Model;

namespace Business.Interfaces
{
    public interface IPedidoBusiness : IBaseBusiness<Pedido, PedidoDto>
    {
        /// <summary>
        /// Crea un pedido nuevo
        /// </summary>
        /// <param name="pedidoCreateDto">Datos del pedido a crear</param>
        /// <returns>Pedido creado</returns>
        Task<PedidoDto> CreateOrderAsync(PedidoCreateDto pedidoCreateDto);

        /// <summary>
        /// Obtiene pedidos de un usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Lista de pedidos del usuario</returns>
        Task<List<PedidoDto>> GetOrdersByUserAsync(int usuarioId);

        /// <summary>
        /// Obtiene pedidos por estado
        /// </summary>
        /// <param name="estado">Estado del pedido</param>
        /// <returns>Lista de pedidos en el estado especificado</returns>
        Task<List<PedidoDto>> GetOrdersByStatusAsync(string estado);

        /// <summary>
        /// Obtiene un pedido con productos incluidos
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <returns>Pedido con productos cargados</returns>
        Task<PedidoDto> GetOrderWithProductsAsync(int pedidoId);

        /// <summary>
        /// Obtiene un pedido por su número
        /// </summary>
        /// <param name="numero">Número del pedido</param>
        /// <returns>Pedido encontrado</returns>
        Task<PedidoDto?> GetOrderByNumberAsync(string numero);

        /// <summary>
        /// Actualiza el estado de un pedido
        /// </summary>
        /// <param name="pedidoUpdateDto">Datos de actualización</param>
        /// <returns>Pedido actualizado</returns>
        Task<PedidoDto> UpdateOrderStatusAsync(PedidoUpdateDto pedidoUpdateDto);

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
        Task<List<PedidoDto>> GetOrdersByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin);

        /// <summary>
        /// Calcula el total de un pedido
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <returns>Total del pedido</returns>
        Task<decimal> CalculateOrderTotalAsync(int pedidoId);

        /// <summary>
        /// Cancela un pedido
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <param name="motivo">Motivo de cancelación</param>
        /// <returns>True si se canceló correctamente</returns>
        Task<bool> CancelOrderAsync(int pedidoId, string motivo);

        /// <summary>
        /// Marca un pedido como entregado
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <returns>True si se marcó como entregado</returns>
        Task<bool> MarkAsDeliveredAsync(int pedidoId);

        /// <summary>
        /// Obtiene pedidos por usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Lista de pedidos del usuario</returns>
        Task<IEnumerable<PedidoDto>> GetByUsuarioIdAsync(int usuarioId);

        /// <summary>
        /// Crea un pedido desde carrito
        /// </summary>
        /// <param name="dto">Datos para crear el pedido</param>
        /// <returns>Pedido creado</returns>
        Task<PedidoDto?> CrearPedidoDesdeCarritoAsync(CrearPedidoDesdeCarritoDto dto);

        /// <summary>
        /// Actualiza el estado de un pedido
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <param name="estado">Nuevo estado</param>
        /// <param name="notas">Notas adicionales</param>
        /// <returns>Pedido actualizado</returns>
        Task<PedidoDto?> ActualizarEstadoAsync(int pedidoId, string estado, string? notas);

        /// <summary>
        /// Confirma la entrega de un pedido
        /// </summary>
        /// <param name="pedidoId">ID del pedido</param>
        /// <param name="fechaEntrega">Fecha de entrega</param>
        /// <param name="referenciaPago">Referencia de pago</param>
        /// <returns>Pedido actualizado</returns>
        Task<PedidoDto?> ConfirmarEntregaAsync(int pedidoId, DateTime fechaEntrega, string? referenciaPago);

        /// <summary>
        /// Obtiene pedidos por estado
        /// </summary>
        /// <param name="estado">Estado del pedido</param>
        /// <returns>Lista de pedidos con el estado especificado</returns>
        Task<IEnumerable<PedidoDto>> GetByEstadoAsync(string estado);
    }
}

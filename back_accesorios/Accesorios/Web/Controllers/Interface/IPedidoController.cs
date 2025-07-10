using Microsoft.AspNetCore.Mvc;
using Entity.Dtos;
using Entity.Model;

namespace Web.Controllers.Interface
{
    public interface IPedidoController : IGenericController<PedidoDto, Pedido>
    {
        /// <summary>
        /// Obtiene todos los pedidos del usuario actual
        /// </summary>
        /// <returns>Lista de pedidos del usuario</returns>
        Task<IActionResult> GetMyPedidos();

        /// <summary>
        /// Obtiene pedidos por usuario
        /// </summary>
        /// <param name="usuarioId">ID del usuario</param>
        /// <returns>Lista de pedidos del usuario</returns>
        Task<IActionResult> GetByUsuario(int usuarioId);

        /// <summary>
        /// Obtiene pedidos por estado
        /// </summary>
        /// <param name="estado">Estado del pedido</param>
        /// <returns>Lista de pedidos con el estado especificado</returns>
        Task<IActionResult> GetByEstado(string estado);

        /// <summary>
        /// Crea un pedido desde el carrito del usuario
        /// </summary>
        /// <param name="request">Datos del pedido</param>
        /// <returns>Pedido creado</returns>
        Task<IActionResult> CreateFromCart([FromBody] CrearPedidoDesdeCarritoDto request);

        /// <summary>
        /// Actualiza el estado de un pedido
        /// </summary>
        /// <param name="id">ID del pedido</param>
        /// <param name="request">Nuevo estado</param>
        /// <returns>Pedido actualizado</returns>
        Task<IActionResult> UpdateEstado(int id, [FromBody] UpdateEstadoRequest request);

        /// <summary>
        /// Cancela un pedido
        /// </summary>
        /// <param name="id">ID del pedido</param>
        /// <returns>Resultado de la operación</returns>
        Task<IActionResult> Cancel(int id);

        /// <summary>
        /// Confirma un pedido
        /// </summary>
        /// <param name="id">ID del pedido</param>
        /// <returns>Resultado de la operación</returns>
        Task<IActionResult> Confirm(int id);

        /// <summary>
        /// Marca un pedido como entregado
        /// </summary>
        /// <param name="id">ID del pedido</param>
        /// <returns>Resultado de la operación</returns>
        Task<IActionResult> MarkAsDelivered(int id);

        /// <summary>
        /// Obtiene las estadísticas de pedidos
        /// </summary>
        /// <returns>Estadísticas de pedidos</returns>
        Task<IActionResult> GetStatistics();
    }

    public class UpdateEstadoRequest
    {
        public string Estado { get; set; } = string.Empty;
        public string? Notas { get; set; }
    }
}

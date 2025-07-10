using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers.Interface
{
    public interface IGenericController<TDto, TEntity>
        where TEntity : class
    {
        Task<IActionResult> GetAll();
        Task<IActionResult> GetById(int id);
        Task<IActionResult> Create(TDto dto);
        Task<IActionResult> Update(TDto dto);
        Task<IActionResult> Delete(int id);
        Task<IActionResult> SoftActive(int id);
    }
}
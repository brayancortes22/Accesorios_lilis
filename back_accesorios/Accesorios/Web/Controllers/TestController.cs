using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { 
                message = "API funcionando correctamente", 
                timestamp = DateTime.Now,
                servidor = Environment.MachineName
            });
        }

        [HttpGet("cors")]
        public IActionResult TestCors()
        {
            return Ok(new { 
                message = "CORS configurado correctamente",
                origin = Request.Headers["Origin"].ToString(),
                userAgent = Request.Headers["User-Agent"].ToString()
            });
        }
    }
}

using kocsma_v3.Modells;
using Microsoft.AspNetCore.Mvc;

namespace kocsma_v3.Controllers
{
    [ApiController]
    [Route("api/raktar")]
    [Tags("Raktár")]
    public class RaktarController : ControllerBase
    {
        private readonly KocsmaContext context;
        public RaktarController(KocsmaContext context)
        {
            this.context = context;
        }

        [HttpGet("italok")]
        public IActionResult OsszesAlkoholosItal()
        {
            var italok = context.Italok.ToList();
            return Ok(italok);
        }
    }
}
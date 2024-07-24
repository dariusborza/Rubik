using Microsoft.AspNetCore.Mvc;
using RubikApi.Models;
using RubikApi.Services;

namespace RubikApi.Controllers
{

    [ApiController]
    [Route("[controller]")]

    public class HomeTopController : Controller
    {
        private readonly IHomeTopService _homeTopService;

        public HomeTopController(IHomeTopService service)
        {
            _homeTopService = service;
        }

        [HttpGet("get-home-top")]
        public async Task<ActionResult<List<MyProfileUser>>> GetHomeTop()
        {
            var topUsersList = await _homeTopService.GetHomeTopUsers();

            if(topUsersList == null) 
            { 
                return NotFound("There are no users");
            }

            return Ok(topUsersList);
        }
    }
}

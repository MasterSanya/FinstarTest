using Microsoft.AspNetCore.Mvc;
using FinstarTest.Data;
using FinstarTest.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace FinstarTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        private readonly DataContext _context;

        public DataController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PostData([FromBody] List<Dictionary<int, string>> inputData)
        {
            // Очистка таблицы
            _context.DataItems.RemoveRange(_context.DataItems);
            await _context.SaveChangesAsync();

            // Преобразование и сортировка данных
            var dataItems = inputData
                .SelectMany(dict => dict.Select(kv => new DataItem { Code = kv.Key, Value = kv.Value }))
                .OrderBy(item => item.Code)
                .ToList();

            // Сохранение данных в БД
            await _context.DataItems.AddRangeAsync(dataItems);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetData([FromQuery] string? filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = _context.DataItems.AsQueryable();

            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(item => (item.Code.ToString().Contains(filter) || item.Value != null && item.Value.Contains(filter)));
            }

            var totalItems = await query.CountAsync();
            var dataItems = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new
            {
                TotalItems = totalItems,
                Items = dataItems
            };

            return Ok(result);
        }
    }
}

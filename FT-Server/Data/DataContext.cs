using Microsoft.EntityFrameworkCore;
using FinstarTest.Models;

namespace FinstarTest.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        // Таблица DataItems
        public DbSet<DataItem> DataItems { get; set; }
    }
}

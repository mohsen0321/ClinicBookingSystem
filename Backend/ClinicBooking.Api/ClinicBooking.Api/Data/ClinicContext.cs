using ClinicBooking.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Api.Data
{
    public class ClinicContext : DbContext
    {
        public ClinicContext(DbContextOptions<ClinicContext> options) : base(options) { }


        public DbSet<User> Users => Set<User>();
        public DbSet<Clinic> Clinics => Set<Clinic>();
        public DbSet<Appointment> Appointments => Set<Appointment>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Appointment>()
                .HasIndex(a => new { a.ClinicId, a.AppointmentDate, a.AppointmentTime })
                .IsUnique();

            modelBuilder.Entity<Clinic>().HasData
                (
                new Clinic   { Id = 1, Name= "طب أسنان" },
                  new Clinic { Id = 2, Name = "طب عيون" },
                  new Clinic { Id = 3, Name = "طب باطنة" },
                  new Clinic { Id = 4, Name = "طب الجراحة" },
                  new Clinic { Id = 5, Name = "طب عام" }
                );

        }

    }
}

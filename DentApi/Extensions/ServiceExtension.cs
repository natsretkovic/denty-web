using DentApi.Services;

namespace DentApi.Extensions
{
    public static class ServiceExtension
    {
        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddSingleton<PacijentServis>();
            services.AddSingleton<KartonServis>();
            services.AddSingleton<MenadzmentServis>();

        }
    }
}
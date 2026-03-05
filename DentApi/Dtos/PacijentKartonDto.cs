using DentApi.Models;

namespace DentApi.Dtos
{

    public class PacijentKartonDto
    {

        public Karton Karton { get; set; } = null!;
        public Pacijent Pacijent { get; set; } = null!;

    }
}
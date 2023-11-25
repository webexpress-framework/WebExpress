using System.Reflection;
using WebExpress.Core;

namespace WebExpress.App
{
    internal class Program
    {
        /// <summary>
        /// The entry point of the WebExpress.
        /// </summary>
        /// <param name="args">Command-line arguments passed to the application.</param>
        private static void Main(string[] args)
        {
            var app = new WebEx()
            {
                Name = Assembly.GetExecutingAssembly().GetName().Name
            };

            app.Execution(args);
        }
    }
}

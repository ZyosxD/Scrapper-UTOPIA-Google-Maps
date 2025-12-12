require('dotenv').config();
const readline = require('readline-sync');
const Scraper = require('./scraper');
const ExcelManager = require('./excel_manager');

// ANSI Color Codes
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
    }
};

function showBanner() {
    console.clear();
    console.log(colors.fg.cyan + `
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ` + colors.reset);

    console.log(colors.fg.yellow + colors.bright + "    🕵️‍♂️  SHERLOCK BUSINESS SCRAPER  🕵️‍♀️" + colors.reset);
    console.log(colors.fg.gray + "    🔍  Finding clues in Utopia Fiber areas..." + colors.reset);
    console.log(colors.fg.cyan + "    ========================================" + colors.reset + "\n");
}

// Handle Ctrl+C (SIGINT)
process.on('SIGINT', () => {
    console.log(colors.reset); // Reset colors just in case
    console.log("\n" + colors.bg.red + colors.fg.white + " 🛑  PROCESS PAUSED " + colors.reset);

    // We need to release stdin to let readline-sync work if it was paused?
    // Actually readline-sync inside a signal handler works but can be tricky depending on the loop.
    // However, usually `readline-sync` captures input from TTY.

    const answer = readline.keyInYNStrict(colors.fg.yellow + " 🛑  ¿Estás listo para detener el proceso? (Are you sure you want to stop?) " + colors.reset);

    if (answer) {
        console.log("\n" + colors.fg.red + " 👋  Terminating process... See you soon!" + colors.reset);
        process.exit(0);
    } else {
        console.log("\n" + colors.fg.green + " ▶️   Resuming investigation..." + colors.reset);
        // The process continues automatically as we just return from the handler
    }
});

async function main() {
    showBanner();

    let apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.log(colors.fg.blue + " 🔑  API Key required for access." + colors.reset);
        apiKey = readline.question(colors.bright + ' ➤ Enter your Google Places API Key: ' + colors.reset, {
            hideEchoBack: true
        });
    }

    if (!apiKey) {
        console.error(colors.fg.red + " ❌  API Key is required to proceed." + colors.reset);
        process.exit(1);
    }

    console.log("\n" + colors.fg.magenta + " 📂  CASE FILE CONFIGURATION" + colors.reset);
    const category = readline.question(colors.bright + ' ➤ Enter the business category (RUBRO) to search for (e.g., "Coffee Shop", "Dentist"): ' + colors.reset);
    if (!category.trim()) {
        console.error(colors.fg.red + " ❌  Category cannot be empty." + colors.reset);
        process.exit(1);
    }

    const scraper = new Scraper(apiKey, colors);
    const excelManager = new ExcelManager(undefined, colors);

    // 1. Get Cities
    const cities = await scraper.getCities();

    if (cities.length === 0) {
        console.error(colors.fg.red + " ❌  No cities found to search." + colors.reset);
        process.exit(1);
    }

    console.log(colors.fg.cyan + `\n 🌍  Target identified: ${cities.length} cities/areas in Utopia Fiber network.` + colors.reset);
    console.log(colors.fg.green + ` 🚀  Starting investigation for: "${colors.bright}${category}${colors.reset}${colors.fg.green}"` + colors.reset + "\n");

    // 2. Iterate and Search
    for (const city of cities) {
        const businesses = await scraper.findBusinesses(city, category);

        if (businesses.length > 0) {
            excelManager.saveData(businesses);
        }
    }

    console.log("\n" + colors.fg.cyan + " ========================================" + colors.reset);
    console.log(colors.fg.green + colors.bright + " ✅  CASE CLOSED. Scraping completed." + colors.reset);
    console.log(colors.fg.yellow + " 📄  Evidence secured in 'results.xlsx'." + colors.reset);
    console.log(colors.fg.cyan + " ========================================" + colors.reset);
}

main();

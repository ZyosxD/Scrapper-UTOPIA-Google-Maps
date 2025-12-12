require('dotenv').config();
const readline = require('readline-sync');
const Scraper = require('./scraper');
const ExcelManager = require('./excel_manager');

async function main() {
    console.log("Welcome to the Utopia Fiber Business Scraper");
    console.log("-------------------------------------------");

    let apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        apiKey = readline.question('Enter your Google Places API Key: ', {
            hideEchoBack: true // Masking the input
        });
    }

    if (!apiKey) {
        console.error("API Key is required to proceed.");
        process.exit(1);
    }

    const category = readline.question('Enter the business category (RUBRO) to search for (e.g., "Coffee Shop", "Dentist"): ');
    if (!category.trim()) {
        console.error("Category cannot be empty.");
        process.exit(1);
    }

    const scraper = new Scraper(apiKey);
    const excelManager = new ExcelManager();

    // 1. Get Cities
    const cities = await scraper.getCities();

    if (cities.length === 0) {
        console.error("No cities found to search.");
        process.exit(1);
    }

    console.log(`\nStarting search for "${category}" across ${cities.length} cities/areas.`);

    // 2. Iterate and Search
    for (const city of cities) {
        // Add a small delay/sleep to avoid hitting rate limits too aggressively
        // though axios calls are sequential here.
        const businesses = await scraper.findBusinesses(city, category);

        if (businesses.length > 0) {
            // 3. Save incrementally (or could batch at the end)
            // Saving incrementally is safer against crashes.
            excelManager.saveData(businesses);
        }
    }

    console.log("\n-------------------------------------------");
    console.log("Scraping completed.");
    console.log("Check 'results.xlsx' for the output.");
}

main();

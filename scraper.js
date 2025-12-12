const axios = require('axios');
const cheerio = require('cheerio');

// const CITIES_URL = 'https://www.utopiafiber.com/cities/'; // Keeping URL for reference but not scraping dynamically for stability.

class Scraper {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.cities = [
            "Brigham City, UT",
            "Cedar Hills, UT",
            "Centerville, UT",
            "Clearfield, UT",
            "Layton, UT",
            "Lindon, UT",
            "Midvale, UT",
            "Morgan City, UT",
            "Murray, UT",
            "Orem, UT",
            "Payson, UT",
            "Perry, UT",
            "Pleasant Grove, UT",
            "Santa Clara, UT",
            "Syracuse, UT",
            "Tremonton, UT",
            "West Haven, UT",
            "West Point, UT",
            "West Valley City, UT",
            "Woodland Hills, UT"
        ];
    }

    // Return the list of cities
    async getCities() {
        // We use a predefined list derived from https://www.utopiafiber.com/cities/
        // to ensure reliability and avoid breakage if the site structure changes.
        console.log(`Loaded ${this.cities.length} cities/areas from configuration.`);
        return this.cities;
    }

    async findBusinesses(city, category) {
        if (!this.apiKey) {
            console.error("API Key is missing. Cannot search Google Places.");
            return [];
        }

        const results = [];
        let nextPageToken = null;

        console.log(`Searching for "${category}" in ${city}...`);

        do {
            try {
                // Text Search is usually better for "Category in City"
                // Endpoint: https://maps.googleapis.com/maps/api/place/textsearch/json
                const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
                const params = {
                    query: `${category} in ${city}`,
                    key: this.apiKey
                };

                if (nextPageToken) {
                    params.pagetoken = nextPageToken;
                    // Google requires a short delay before using the page token
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

                const response = await axios.get(url, { params });

                if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
                    console.error(`API Error for ${city}: ${response.data.status} - ${response.data.error_message || ''}`);
                    break;
                }

                const places = response.data.results || [];

                for (const place of places) {
                    // Extract basic info
                    let business = {
                        'Business Name': place.name,
                        'Location': place.formatted_address,
                        'Phone Number': '',
                        'Website': '',
                        'Email': '' // Google Places API rarely returns email directly
                    };

                    // We might need Place Details for Phone and Website if not present (Text Search usually returns basic info)
                    // Text Search returns formatted_address, name, place_id.
                    // It does NOT guarantee phone number or website in the list result (depending on fields, but textsearch returns a subset).
                    // Actually, textsearch returns a lot. Let's check if we need more details.
                    // TextSearch results typically include `formatted_address`, `geometry`, `icon`, `id`, `name`, `photos`, `place_id`, `reference`, `types`.
                    // Often `rating`, `user_ratings_total`.
                    // It usually does NOT return website or phone number in the summary list. We need to fetch details.

                    if (place.place_id) {
                         const details = await this.getPlaceDetails(place.place_id);
                         if (details) {
                             business['Phone Number'] = details.formatted_phone_number || details.international_phone_number || '';
                             business['Website'] = details.website || '';
                             // Email is not provided by Google Places API standard fields.
                             // We leave it empty as per prompt "if available".
                         }
                    }

                    results.push(business);
                }

                nextPageToken = response.data.next_page_token;

            } catch (error) {
                console.error(`Error searching in ${city}:`, error.message);
                break;
            }
        } while (nextPageToken);

        console.log(`Found ${results.length} businesses in ${city}.`);
        return results;
    }

    async getPlaceDetails(placeId) {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/details/json`;
            const params = {
                place_id: placeId,
                fields: 'formatted_phone_number,international_phone_number,website',
                key: this.apiKey
            };
            const response = await axios.get(url, { params });
            if (response.data.status === 'OK') {
                return response.data.result;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching details for place_id ${placeId}:`, error.message);
            return null;
        }
    }
}

module.exports = Scraper;

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
                    let business = {
                        'Business Name': place.name,
                        'Location': place.formatted_address,
                        'Phone Number': '',
                        'Website': '',
                        'Email': ''
                    };

                    if (place.place_id) {
                         const details = await this.getPlaceDetails(place.place_id);
                         if (details) {
                             business['Phone Number'] = details.formatted_phone_number || details.international_phone_number || '';
                             business['Website'] = details.website || '';

                             // If website exists, try to scrape email
                             if (business['Website']) {
                                 // Add a small delay to be polite and avoid overwhelming network
                                 const email = await this.scrapeEmailFromWebsite(business['Website']);
                                 if (email) {
                                     business['Email'] = email;
                                 }
                             }
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

    async scrapeEmailFromWebsite(websiteUrl) {
        try {
            // console.log(`Scraping email from ${websiteUrl}...`); // Optional log
            const response = await axios.get(websiteUrl, {
                timeout: 10000, // 10 seconds timeout
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            const html = response.data;
            // Regex to find email addresses. This is a common pattern.
            // It searches for strings that look like emails.
            const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/gi;

            const matches = html.match(emailRegex);
            if (matches && matches.length > 0) {
                // Return the first unique valid-looking email
                // Filter out some common false positives like "rating@2x.png" if necessary,
                // though the regex requires @ and .

                // Deduplicate
                const uniqueEmails = [...new Set(matches.map(e => e.toLowerCase()))];

                // Filter out image extensions just in case (e.g. image@2x.png matches if not careful)
                const validEmails = uniqueEmails.filter(email => {
                    const invalidExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.js', '.css'];
                    return !invalidExtensions.some(ext => email.endsWith(ext));
                });

                return validEmails.length > 0 ? validEmails[0] : '';
            }
            return '';
        } catch (error) {
            // It's common for scraping to fail (timeout, 403, etc). Just return empty.
            // console.error(`Failed to scrape email from ${websiteUrl}: ${error.message}`);
            return '';
        }
    }
}

module.exports = Scraper;

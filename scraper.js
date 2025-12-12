const axios = require('axios');
const cheerio = require('cheerio');

class Scraper {
    constructor(apiKey, colors = {}) {
        this.apiKey = apiKey;
        this.colors = colors;
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

    // Helper for coloring logs
    log(msg, colorCode = "") {
        const reset = this.colors.reset || "";
        console.log((colorCode || "") + msg + reset);
    }

    error(msg) {
        const color = this.colors.fg?.red || "";
        const reset = this.colors.reset || "";
        console.error(color + msg + reset);
    }

    // Return the list of cities
    async getCities() {
        this.log(` 🗺️  Loaded ${this.cities.length} cities/areas from configuration.`, this.colors.fg?.blue);
        return this.cities;
    }

    async findBusinesses(city, category) {
        if (!this.apiKey) {
            this.error(" ❌  API Key is missing. Cannot search Google Places.");
            return [];
        }

        const results = [];
        let nextPageToken = null;

        process.stdout.write((this.colors.fg?.yellow || "") + ` 🔎  Searching in ${city}... ` + (this.colors.reset || ""));

        do {
            try {
                // Text Search
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
                    console.log(""); // New line
                    this.error(`API Error for ${city}: ${response.data.status} - ${response.data.error_message || ''}`);
                    break;
                }

                const places = response.data.results || [];

                // If this is the first page and no results, log it.
                if (places.length === 0 && !nextPageToken) {
                     // Keep silence or log zero?
                }

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
                console.log(""); // New line
                this.error(`Error searching in ${city}: ${error.message}`);
                break;
            }
        } while (nextPageToken);

        if (results.length > 0) {
             console.log((this.colors.fg?.green || "") + `Found ${results.length} businesses. 🎯` + (this.colors.reset || ""));
        } else {
             console.log((this.colors.fg?.gray || "") + `No matches found.` + (this.colors.reset || ""));
        }

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
            // this.error(`Error fetching details for place_id ${placeId}: ${error.message}`);
            return null;
        }
    }

    async scrapeEmailFromWebsite(websiteUrl) {
        try {
            const response = await axios.get(websiteUrl, {
                timeout: 5000, // Reduced timeout for speed
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            const html = response.data;
            const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/gi;

            const matches = html.match(emailRegex);
            if (matches && matches.length > 0) {
                const uniqueEmails = [...new Set(matches.map(e => e.toLowerCase()))];
                const validEmails = uniqueEmails.filter(email => {
                    const invalidExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.js', '.css', '.wav', '.mp3'];
                    return !invalidExtensions.some(ext => email.endsWith(ext));
                });
                return validEmails.length > 0 ? validEmails[0] : '';
            }
            return '';
        } catch (error) {
            return '';
        }
    }
}

module.exports = Scraper;

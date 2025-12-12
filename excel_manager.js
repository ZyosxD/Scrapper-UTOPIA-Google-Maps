const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const FILE_NAME = 'results.xlsx';

class ExcelManager {
  constructor(fileName = FILE_NAME, colors = {}) {
    this.fileName = fileName;
    this.filePath = path.resolve(process.cwd(), fileName);
    this.headers = ['Business Name', 'Phone Number', 'Website', 'Email', 'Location'];
    this.colors = colors;
  }

  // Load existing data or initialize empty list
  loadData() {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }

    try {
      const workbook = xlsx.readFile(this.filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Get JSON data. `defval: ""` ensures empty cells are empty strings.
      const data = xlsx.utils.sheet_to_json(worksheet, { defval: "" });
      return data;
    } catch (error) {
      console.error((this.colors.fg?.red || "") + " ❌  Error reading Excel file: " + error.message + (this.colors.reset || ""));
      return [];
    }
  }

  // Save data to Excel
  saveData(newData) {
    const existingData = this.loadData();
    const finalData = this.deduplicate([...existingData, ...newData]);
    const addedCount = finalData.length - existingData.length;

    // Create a new workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(finalData, { header: this.headers });

    // Set column widths for better readability
    const wscols = [
      { wch: 30 }, // Business Name
      { wch: 20 }, // Phone Number
      { wch: 30 }, // Website
      { wch: 25 }, // Email
      { wch: 50 }, // Location
    ];
    worksheet['!cols'] = wscols;

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Businesses');

    try {
        xlsx.writeFile(workbook, this.filePath);
        if (addedCount > 0 || newData.length > 0) {
            console.log((this.colors.fg?.blue || "") + ` 💾  Saved ${newData.length} new entries to ${this.fileName}. Total unique records: ${finalData.length}` + (this.colors.reset || ""));
        }
    } catch (error) {
        console.error((this.colors.fg?.red || "") + " ❌  Error writing to Excel file: " + error.message + (this.colors.reset || ""));
    }
  }

  deduplicate(data) {
    const unique = new Map();
    data.forEach(item => {
        const name = (item['Business Name'] || '').trim().toLowerCase();
        const phone = (item['Phone Number'] || '').trim().replace(/\D/g, ''); // Remove non-digits
        const location = (item['Location'] || '').trim().toLowerCase();

        let uniqueKey = '';
        if (phone) {
            uniqueKey = `ph:${name}|${phone}`;
        } else {
            uniqueKey = `addr:${name}|${location}`;
        }

        if (!unique.has(uniqueKey)) {
             unique.set(uniqueKey, item);
        }
    });
    return Array.from(unique.values());
  }
}

module.exports = ExcelManager;

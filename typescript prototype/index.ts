import fs from 'fs';
import * as cheerio from 'cheerio'; // Importing the entire module

// Function to scrape a page using fetch (Bun's native fetch)
async function getPage(pageNum: number): Promise<string> {
  console.log(`Fetching page ${pageNum}...`); // Log current page being fetched
  const url = `http://hanzidb.org/character-list/general-standard?page=${pageNum}`;
  const response = await fetch(url);
  const html = await response.text();
  console.log(`Page ${pageNum} fetched successfully.`); // Log successful fetch
  return html;
}

// Function to extract data from a single page
function extractPageData(pageData: string): string {
  console.log(`Extracting data from a page...`); // Log data extraction process
  const $ = cheerio.load(pageData);

  const numRows = $('tbody tr').length;
  const pageVals: string[] = [];

  for (let row = 2; row <= numRows; row++) {
    const colVals: string[] = [];
    for (let col = 1; col <= 8; col++) {
      colVals.push($(`tbody tr:nth-child(${row}) td:nth-child(${col})`).text());
    }
    pageVals.push(colVals.join(','));
  }

  console.log(`Data extracted for page.`); // Log completion of data extraction
  return pageVals.join('\n');
}

// Main scraping function
async function scrapeAndSaveData(): Promise<void> {
  const pageDataPromises: Promise<string>[] = [];
  console.log('Starting scraping process...');

  // Loop over the first 82 pages (can adjust this depending on how many pages you want to scrape)
  for (let i = 1; i <= 82; i++) {
    console.log(`Queuing page ${i} for scraping...`);
    pageDataPromises.push(getPage(i));
    if (i % 10 === 0) {
      console.log(`Pausing for 2 seconds after 10 pages...`);
      // Pause for 2 seconds every 10 requests to avoid being blocked
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Wait for all pages to be scraped
  console.log('Waiting for all pages to be scraped...');
  const pageData = await Promise.all(pageDataPromises);

  // Extract data from all pages and format it
  console.log('Extracting data from all pages...');
  const pageDataCsv = pageData.map(extractPageData).join('\n');

  // Add a header to the CSV
  const header = 'frequency_rank,character,pinyin,definition,radical,radical_code,stroke_count,hsk_level,general_standard_num';

  // Combine the header and the extracted data
  const csvData = [header, pageDataCsv].join('\n');

  // Save the data to a .csv.db file
  const outputFileName = 'hanzi.csv.db';
  console.log(`Saving data to ${outputFileName}...`);
  fs.writeFileSync(outputFileName, csvData, 'utf-8');
  console.log(`Data has been scraped and saved to ${outputFileName}`);
}

// Run the scraping and saving function
scrapeAndSaveData().catch(err => {
  console.error('Error during scraping or saving:', err);
});

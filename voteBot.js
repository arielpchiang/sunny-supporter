const { chromium } = require('playwright');

(async () => {
    console.log('Starting the voting bot...');

    // 1. Launch Chromium browser invisibly
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // 2. Navigate to the page
    console.log('Navigating to the awards page...');
    await page.goto('https://refocus-awards.com/people-vote-award?q=Sunny%20Cheng');

    // 3. Define the categories you want to vote for
    const categories = ['Abstract', 'Fine Art', 'Still Life'];

    // 4. Loop through each category and attempt to vote
    for (const category of categories) {
        const entrySection = page.locator('div[id^="liminal-"]').filter({ hasText: category });
        const voteButton = entrySection.getByRole('button', { name: 'Vote', exact: true });
        
        if (await voteButton.count() > 0) {
            await voteButton.click();
            console.log(`Voted in category: ${category}`);
        } else {
            console.log(`Could not find vote button for: ${category}`);
        }
    }
    
    // 5. Clean up and close
    await browser.close();
    console.log('Finished execution.');
})();

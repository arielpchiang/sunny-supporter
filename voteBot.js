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

    // Wait 5 seconds for the dynamic content to load
    await page.waitForTimeout(5000);

    // 3. Define the categories you want to vote for
    const categories = ['Abstract', 'Fine Art', 'Still Life'];

    // 4. Loop through each category and attempt to vote
    for (const category of categories) {
        // Renamed entrySection back to categoryBlock to match the button logic
        const categoryBlock = page.locator('div[id^="liminal-"]').filter({ hasText: category });
        
        // 5. Define both possible buttons
        const voteButton = categoryBlock.getByRole('button', { name: 'Vote', exact: true });
        const votedButton = categoryBlock.getByRole('button', { name: 'Voted', exact: true });
        
        // 6. Check if the "Voted" button is already there
        if (await votedButton.count() > 0) {
            console.log(`Already voted for: ${category}. No action needed.`);
            continue; // This tells the bot to skip to the next category
        }

        // 7. If not voted yet, check for the "Vote" button and click it
        if (await voteButton.count() > 0) {
            await voteButton.click({ force: true });
            console.log(`Successfully voted in category: ${category}`);

            // Add a tiny pause after clicking to let the site register the vote
            await page.waitForTimeout(2000);
        } else {
            console.log(`Could not find any button for: ${category}`);
        }
    }
    
    // 8. Clean up and close
    await browser.close();
    console.log('Finished execution.');
})();

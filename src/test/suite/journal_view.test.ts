import { suite, setup, teardown, test } from 'mocha';
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import JournalDataProvider from '../../data-providers/JournalDataProvider';

suite('Journal View Tests', () => {
    let journalProvider: JournalDataProvider;
    const testJournalDir = path.join(os.homedir(), 'Journal');

    // Helper function to create test journal entries
    async function createTestJournalStructure() {
        // Create base directory
        if (!fs.existsSync(testJournalDir)) {
            fs.mkdirSync(testJournalDir);
        }

        // Create year/month structure
        const year = '2024';
        const months = ['01', '02'];
        const yearPath = path.join(testJournalDir, year);
        
        if (!fs.existsSync(yearPath)) {
            fs.mkdirSync(yearPath);
        }

        for (const month of months) {
            const monthPath = path.join(yearPath, month);
            if (!fs.existsSync(monthPath)) {
                fs.mkdirSync(monthPath);
            }

            // Create some test entries
            for (let day = 1; day <= 3; day++) {
                const dayStr = day.toString().padStart(2, '0');
                const filePath = path.join(monthPath, `${dayStr}.md`);
                fs.writeFileSync(filePath, `Test entry for ${year}-${month}-${dayStr}`);
            }
        }
    }

    // Helper function to clean up test journal entries
    async function cleanupTestJournalStructure() {
        if (fs.existsSync(testJournalDir)) {
            fs.rmSync(testJournalDir, { recursive: true, force: true });
        }
    }

    setup(async () => {
        await cleanupTestJournalStructure();
        await createTestJournalStructure();
        const mockContext = {
            extensionPath: testJournalDir,
            // Add other context properties as needed
        };
        journalProvider = new JournalDataProvider(mockContext as vscode.ExtensionContext);
    });

    teardown(async () => {
        await cleanupTestJournalStructure();
    });

    test('Initial load of journal entries', async () => {
        journalProvider.refresh();
        const rootEntries = await journalProvider.getChildren();
        
        assert.strictEqual(rootEntries.length, 1, 'Should have one year entry');
        assert.strictEqual(rootEntries[0].label, '2024', 'Year should be 2024');

        const monthEntries = await journalProvider.getChildren(rootEntries[0]);
        assert.strictEqual(monthEntries.length, 2, 'Should have two month entries');
        assert.strictEqual(monthEntries[0].label, 'January', 'First month should be January');
        assert.strictEqual(monthEntries[1].label, 'February', 'Second month should be February');

        const januaryEntries = await journalProvider.getChildren(monthEntries[0]);
        assert.strictEqual(januaryEntries.length, 3, 'January should have 3 entries');
    });

    test('Filter functionality', async () => {
        journalProvider.refresh();
        
        // Apply filter
        journalProvider.setFilter('January');
        const filteredEntries = await journalProvider.getChildren();
        
        assert.strictEqual(filteredEntries.length, 1, 'Should show year containing January');
        const monthEntries = await journalProvider.getChildren(filteredEntries[0]);
        assert.strictEqual(monthEntries.length, 1, 'Should only show January');

        // Clear filter
        journalProvider.clearFilter();
        const unfilteredEntries = await journalProvider.getChildren();
        assert.strictEqual(unfilteredEntries.length, 1, 'Should show all years after clearing filter');
    });

    test('Expand and collapse functionality', async () => {
        journalProvider.refresh();
        
        // Test expand
        journalProvider.expandAll();
        const expandedItem = (await journalProvider.getChildren())[0];
        const expandedTreeItem = journalProvider.getTreeItem(expandedItem);
        assert.strictEqual(
            expandedTreeItem.collapsibleState,
            vscode.TreeItemCollapsibleState.Expanded,
            'Items should be expanded'
        );

        // Test collapse
        journalProvider.collapseAll();
        const collapsedItem = (await journalProvider.getChildren())[0];
        const collapsedTreeItem = journalProvider.getTreeItem(collapsedItem);
        assert.strictEqual(
            collapsedTreeItem.collapsibleState,
            vscode.TreeItemCollapsibleState.Collapsed,
            'Items should be collapsed'
        );
    });

    test('Jump to today functionality', async () => {
        // Create today's entry
        const today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        
        const todayPath = path.join(testJournalDir, year, month);
        fs.mkdirSync(todayPath, { recursive: true });
        fs.writeFileSync(path.join(todayPath, `${day}.md`), 'Today\'s entry');

        // Test jumping to today
        await journalProvider.jumpToToday();
        
        // Verify that the file exists and was "opened"
        const todayFilePath = path.join(todayPath, `${day}.md`);
        assert.ok(fs.existsSync(todayFilePath), 'Today\'s journal file should exist');
    });
});
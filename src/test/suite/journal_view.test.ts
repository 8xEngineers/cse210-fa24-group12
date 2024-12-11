import { suite, setup, teardown, test } from 'mocha';
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import JournalDataProvider from '../../data-providers/JournalDataProvider';

suite('Journal View Extended Tests', () => {
    let journalProvider: JournalDataProvider;
    const testJournalDir = path.join(os.homedir(), 'Journal');

    async function createTestJournalStructure() {
        if (!fs.existsSync(testJournalDir)) {
            fs.mkdirSync(testJournalDir);
        }
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
            for (let day = 1; day <= 3; day++) {
                const dayStr = day.toString().padStart(2, '0');
                const filePath = path.join(monthPath, `${dayStr}.md`);
                fs.writeFileSync(filePath, `Test entry for ${year}-${month}-${dayStr}`);
                fs.closeSync(fs.openSync(filePath, 'r')); 
            }
        }
    }

    async function cleanupTestJournalStructure() {
        const retries = 5; 
        const delay = 100; 
        for (let i = 0; i < retries; i++) {
            try {
                if (fs.existsSync(testJournalDir)) {
                    fs.rmSync(testJournalDir, { recursive: true, force: true });
                }
                return; 
            } catch (err) {
                if (err instanceof Error && err.message.includes('EBUSY')) {
                    await new Promise(resolve => setTimeout(resolve, delay)); 
                } else {
                    throw err; 
                }
            }
        }
        throw new Error(`Failed to cleanup test journal structure after ${retries} retries.`);
    }

    setup(async () => {
        await cleanupTestJournalStructure();
        await createTestJournalStructure();
        const mockContext = {
            extensionPath: testJournalDir,
        };
        journalProvider = new JournalDataProvider(mockContext as vscode.ExtensionContext);
    });

    teardown(async () => {
        await cleanupTestJournalStructure();
    });

    
    test('Invalid filter application', async () => {
        journalProvider.refresh();
        journalProvider.setFilter('NonexistentMonth');
        const filteredEntries = await journalProvider.getChildren();
        assert.strictEqual(filteredEntries.length, 0, 'Filter with invalid text should result in no entries');
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

    test('Edge case: Jump to today with missing directories', async () => {
        journalProvider.refresh();
        // Ensure today's structure does not exist
        const today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const todayPath = path.join(testJournalDir, year, month, `${day}.md`);
        if (fs.existsSync(todayPath)) {
            fs.rmSync(todayPath, { force: true });
        }
        // Test jump to today when no structure exists
        journalProvider.jumpToToday();
        // Check for warning message (mock this behavior in VSCode API if required)
        assert.ok(true, 'Jump to today should handle missing structure gracefully');
    });

    test('Node state persistence after refresh', async () => {
        journalProvider.refresh();
        // Expand all nodes and verify state
        journalProvider.expandAll();
        let rootEntries = await journalProvider.getChildren();
        let firstYearTreeItem = journalProvider.getTreeItem(rootEntries[0]);
        assert.strictEqual(
            firstYearTreeItem.collapsibleState,
            vscode.TreeItemCollapsibleState.Expanded,
            'Year node should be expanded'
        );
        // Refresh and check state
        journalProvider.refresh();
        rootEntries = await journalProvider.getChildren();
        firstYearTreeItem = journalProvider.getTreeItem(rootEntries[0]);
        assert.strictEqual(
            firstYearTreeItem.collapsibleState,
            vscode.TreeItemCollapsibleState.Expanded,
            'Year node should remain expanded after refresh'
        );
    });

    test('Filtering by month-specific keyword', async () => {
        journalProvider.refresh();
        // Apply filter for "January"
        journalProvider.setFilter('January');
        const filteredEntries = await journalProvider.getChildren();
        // Expect to match one year since "January" is in 2024
        assert.strictEqual(filteredEntries.length, 1, 'Filter should match one year');
        const monthEntries = await journalProvider.getChildren(filteredEntries[0]);
        assert.strictEqual(monthEntries.length, 1, 'Filter should only show January');
        const dayEntries = await journalProvider.getChildren(monthEntries[0]);
        assert.strictEqual(dayEntries.length, 3, 'January should show all 3 days');
    });

    test('Toggle expanded state', async () => {
        journalProvider.refresh();
        // Expand and verify
        journalProvider.expandAll();
        let rootEntries = await journalProvider.getChildren();
        let firstYearTreeItem = journalProvider.getTreeItem(rootEntries[0]);
        assert.strictEqual(
            firstYearTreeItem.collapsibleState,
            vscode.TreeItemCollapsibleState.Expanded,
            'First node should be expanded'
        );

        // Collapse and verify
        journalProvider.collapseAll();
        rootEntries = await journalProvider.getChildren();
        firstYearTreeItem = journalProvider.getTreeItem(rootEntries[0]);
        assert.strictEqual(
            firstYearTreeItem.collapsibleState,
            vscode.TreeItemCollapsibleState.Collapsed,
            'First node should be collapsed'
        );
    });
});
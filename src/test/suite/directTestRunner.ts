import * as vscode from 'vscode';
import { MatchInput } from '../../provider';
import { TestLogger } from '../TestLogger';

export async function run(): Promise<void> {
    console.log('Running test runner for direct tests.');

    try {

        const inputMatcher = new MatchInput(new TestLogger(false), 'en-US');
        const str = 'next monday';
        const input = await inputMatcher.parseInput(str);

        console.log('Parsed flags:', input.flags);
    } catch (err) {
        console.error('Error running direct test:', err);
        throw err; // Ensure errors are properly logged
    }

    console.log('Test runner completed.');
}
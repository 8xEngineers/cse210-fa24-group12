import { MatchInput } from '../../provider';
import { TestLogger } from '../TestLogger';

(async function runTest() {
    const inputMatcher = new MatchInput(new TestLogger(false), "en-US");
    const str = "next monday";
    const input = await inputMatcher.parseInput(str);

    // Output to console
    console.log("Parsed flags:", input.flags);
})();

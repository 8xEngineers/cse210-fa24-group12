import { MatchInput } from '../../provider';
import { TestLogger } from '../TestLogger';

(async function runTest() {
    let inputMatcher = new MatchInput(new TestLogger(false), "en-US");
    let str = "next monday";
    let input = await inputMatcher.parseInput(str);

    // Output to console
    console.log("Parsed flags:", input.flags);
})();

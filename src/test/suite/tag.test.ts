import * as assert from 'assert';
import Tag from "../../models/Tag";
import { TreeItemCollapsibleState } from "vscode";
import { suite, test } from 'mocha';

suite("Tag Model Tests", () => {
 test("Create a tag with formatted path", () => {
   const tag = new Tag("urgent", TreeItemCollapsibleState.Collapsed, "./file.txt");
   assert.strictEqual(tag.path, "./file.txt", "Path should be formatted correctly");
 });

 test("Handle undefined path gracefully", () => {
   const tag = new Tag("urgent", TreeItemCollapsibleState.None);
   assert.strictEqual(tag.path, undefined, "Path should be undefined when not provided");
 });
});
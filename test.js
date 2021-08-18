import sinon from "sinon";
import { suite } from "uvu";
import { bulkThreadAction } from "./main.js";

const { assert, fake, stub } = sinon;

const query = "test";
const search = stub();
const threadAction = fake();

const act = bulkThreadAction.bind(null, query, threadAction);

global.GmailApp = {
  search,
};

const BTA = suite("bulkThreadAction");

BTA.after.each(() => {
  threadAction.resetHistory();
});

BTA("Takes no action when there are no threads", () => {
  search.returns([]);

  act();

  assert.notCalled(threadAction);
});

BTA("Does not chunk <= 100 threads", () => {
  const fakeThreads = Array(100).fill(0);
  search.returns(fakeThreads);

  act();

  assert.calledOnceWithExactly(threadAction, fakeThreads);
});

BTA("Properly chunks > 100 threads", () => {
  search.returns(Array(1000).fill(0));

  act();

  assert.callCount(threadAction, 10);
});

BTA.run();

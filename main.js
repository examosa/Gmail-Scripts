// Using IIFE to prevent GAS from picking up these utility functions
const bulkThreadAction = (() => {
  /**
 * Splits the given array into subarrays of the given size
 * @param {unknown[]} array
 * @param {number} chunkSize
 * @returns {unknown[][]}
 */
  const chunk = (array, chunkSize) =>
    array.reduce((array2, thread, idx) =>
      idx % chunkSize === 0
        ? [...array2, [thread]]
        : [...array2.slice(0, -1), [...array2.slice(-1)[0], thread]], []);

  /** @typedef {(threads: unknown[]) => void} threadAction */

  /**
 * GmailApp will error if its thread functions are called with more than 100 threads at a time.
 * This wrapper ensures threads are appropriately split to prevent said error.
 * @param {string} query
 * @param {threadAction} action
 * @returns {void}
 */
  function bulkThreadAction(query, action) {
    console.info(`Searching for threads matching: [${query}]`);
    /** @type {unknown[]} */
    const targetThreads = GmailApp.search(query);

    if (targetThreads.length === 0) {
      console.info("No threads to operate on");
      return;
    }

    console.info(`Calling ${action.name} with ${targetThreads.length} threads`);

    if (targetThreads.length <= 100) {
      console.info("Not chunking; <= 100 threads");
      action(targetThreads);
      return;
    }

    const chunkedThreads = chunk(targetThreads, 100);
    console.info(`Split threads into ${chunkedThreads.length} chunks`);
    chunkedThreads.forEach((threadChunk) => action(threadChunk));
  }
  return bulkThreadAction;
})();

/**
 * Deletes labels of interest older than 90 days
 */
function deleteOldLabels() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const dateString = ninetyDaysAgo.toLocaleDateString();
  const targetLabels = ["", "/bills", "/receipts"].map((sub) =>
    `label:finances${sub}`
  ).join(" OR ");

  bulkThreadAction(
    `${targetLabels} before:${dateString}`,
    GmailApp.moveThreadsToTrash,
  );
}

/**
 * Marks deleted threads as read
 */
function markDeletedAsRead() {
  bulkThreadAction("is:unread in:trash", GmailApp.markThreadsRead);
}

// (Until I figure out a way to bundle this file
// that isn't over-engineered and unreadable)
// Uncomment to run tests
// export { bulkThreadAction };

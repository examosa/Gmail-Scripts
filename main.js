const bulkThreadAction = (() => {
  const chunk = (array, chunkSize) =>
    array.reduce((array2, thread, idx) =>
      idx % chunkSize === 0
        ? [...array2, [thread]]
        : [...array2.slice(0, -1), [...array2.slice(-1)[0], thread]], []);

  function bulkThreadAction(query, action) {
    const targetThreads = GmailApp.search(query);
    if (targetThreads.length === 0) {
      console.info("No threads to operate on");
      return;
    }
    if (targetThreads.length <= 100) {
      console.info("<= 100 threads; not chunking");
      action(targetThreads);
      return;
    }
    console.info(`Chunking ${targetThreads.length} threads`);
    const chunkedThreads = chunk(targetThreads, 100);
    chunkedThreads.forEach((threadChunk) => action(threadChunk));
  }

  return bulkThreadAction;
})();

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

const markDeletedAsRead = () =>
  bulkThreadAction("is:unread in:trash", GmailApp.markThreadsRead);

export { bulkThreadAction };

// Delete receipts older than 60 days
function deleteOldReceipts() {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const dateString = sixtyDaysAgo.toLocaleDateString();
  const chunkSize = 100;

  const oldThreads = GmailApp.search(`label:Receipts before:${dateString}`);

  if (oldThreads.length <= chunkSize) {
    GmailApp.moveThreadsToTrash(oldThreads);
    return;
  }

  const chunkedThreads = oldThreads.reduce(
    (array, thread, idx) =>
      idx % chunkSize === 0
        ? [...array, [thread]]
        : [...array.slice(0, -1), [...array.slice(-1)[0], thread]],
    []
  );

  chunkedThreads.forEach((threadChunk) =>
    GmailApp.moveThreadsToTrash(threadChunk)
  );
}

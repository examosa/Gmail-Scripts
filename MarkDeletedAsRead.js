function markDeletedAsRead() {
  const chunkSize = 100;

  const unreadTrashThreads = GmailApp.search("is:unread in:trash");

  if (unreadTrashThreads.length <= chunkSize) {
    GmailApp.markThreadsRead(unreadTrashThreads);
    return;
  }

  const chunkedThreads = unreadTrashThreads.reduce(
    (array, thread, idx) =>
      idx % chunkSize === 0
        ? [...array, [thread]]
        : [...array.slice(0, -1), [...array.slice(-1)[0], thread]],
    []
  );

  chunkedThreads.forEach((threadChunk) =>
    GmailApp.markThreadsRead(threadChunk)
  );
}

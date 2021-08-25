# Gmail Scripts

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

These are just some basic automated tasks created using [Google Apps Script (GAS)](https://www.google.com/script/start/). They are described below.

## Functions

### Delete Old Labels

I use labels to hang on to emails that I could need again in the immediate future. After months, however, I usually don't still need them. This function deletes emails by label older than a certain threshold (for my use case: 90 days).

### Mark Deleted As Read

Sometimes I delete emails without opening them (you know the type). I run this function periodically to mark all unread deleted emails as read.

## Building

Run `npm run build`. 'Course, all this does right now is copy `main.js` and `appsscript.json` into the `dist/` folder. Haven't yet figured out a satisfactory way to bundle the source code for GAS, but am open to suggestions.

## Testing

Run `npm test`. Note that you will need to uncomment the export at the end of `main.js` for the tests to run properly.

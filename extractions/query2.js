module.exports = {
  destinationDataset: 'temp',
  destinationTable: (tableSulfix) => `digital__${tableSulfix}`,
  extractionBucket: 'fabricio-frontarolli',
  extractionFile: (fileSulfix) => `digital__${fileSulfix}`,
  sql: `
    SELECT
      id,
      name
    FROM test.users
    LIMIT 10
  `
};

module.exports = {
  destinationDataset: 'test',
  destinationTable: 'temporary',
  extractionBucket: 'fabricio-frontarolli',
  extractionFile: 'query.gz',
  sql: `
    SELECT
      id,
      name
    FROM test.users
    LIMIT 10
  `
};

const BigQuery = require('@google-cloud/bigquery');
const Storage = require('@google-cloud/storage');
const moment = require('moment');
const ExtractionCommands = require('./extractions');

const BQ = new BigQuery();
const GCS = new Storage();

const extractionProcedures = ExtractionCommands.map((extractionCommand) => {
  return extractBigQueryDataToGCS(extractionCommand);
});

Promise.all(extractionProcedures)
       .then(() => {

       });

function extractBigQueryDataToGCS(extractionCommand) {
  const extractionPromise = new Promise((resolve, reject) => {
    const currentDateFormatted = moment().format('YYYY_MM_DD');
    const destinationTable = BQ.dataset(extractionCommand.destinationDataset).table(extractionCommand.destinationTable);

    try {
      const jobResult = BQ.createQueryJob({
        destination: destinationTable,
        query: extractionCommand.sql
      })
      .then((jobResult) => {
        const job = jobResult[0];

        return new Promise((resolve) => {
          job.on('complete', (metadata) => {
            return resolve(metadata);
          });
        });
      })
      .then(() => {
        const outputFile = GCS.bucket(extractionCommand.extractionBucket).file(extractionCommand.extractionFile);

        return destinationTable.extract(outputFile, {
          format: 'JSON',
          gzip: true
        })
        .then((extractionResponse) => {
          return extractionResponse;
        });
      })
      .then((extractionResponse) => {
        console.log(`extractionResponse >>> ${JSON.stringify(extractionResponse, null, 2)}`);
      });
    }
    catch (error) {
      console.log(error);
    }
  });

  return extractionPromise;
}

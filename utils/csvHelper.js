const { createObjectCsvStringifier } = require("csv-writer");
const csv = require("csv-parser");

// Convert CSV stream to JSON
const csvToJson = async (csvStream) => {
  return new Promise((resolve, reject) => {
    const jsonData = [];
    
    csvStream.pipe(csv())
      .on("data", (row) => jsonData.push(row))
      .on("end", () => resolve(jsonData))
      .on("error", (error) => reject(error));
  });
};

// Función para convertir JSON a CSV
const jsonToCsv = (data, headers) => {
  const csvStringifier = createObjectCsvStringifier({ header: headers });

  if (!Array.isArray(data)) {
    data = [data]; // Asegurar que siempre sea un array
  }

  const csvHeader = csvStringifier.getHeaderString();
  const csvBody = csvStringifier.stringifyRecords(data);

  return csvHeader + csvBody;
};

// Definir estructuras de CSV
const csvHeaders = {
  config: [
    { id: "maxVehicles", title: "maxVehicles" },
    { id: "capacity", title: "capacity" },
    { id: "depotx", title: "depotx" },
    { id: "depoty", title: "depoty" },
    { id: "horizon", title: "horizon" },
  ],
  custNode: [
    { id: "id", title: "id" },
    { id: "name", title: "name" },
    { id: "x", title: "x" },
    { id: "y", title: "y" },
    { id: "demand", title: "demand" },
    { id: "begin", title: "begin" },
    { id: "end", title: "end" },
    { id: "service", title: "service" },
  ],
};

module.exports = { csvToJson ,jsonToCsv, csvHeaders };

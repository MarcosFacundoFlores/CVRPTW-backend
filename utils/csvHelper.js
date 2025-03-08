const { createObjectCsvStringifier } = require("csv-writer");

// Función genérica para convertir JSON a CSV
const jsonToCsv = (data, headers) => {
  const csvStringifier = createObjectCsvStringifier({ header: headers });
  const csvHeader = csvStringifier.getHeaderString();
  const csvBody = csvStringifier.stringifyRecords([data]); // Solo una fila
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
    { id: "begin", title: "begin"},
    {id: "end", title: "end"},
    {id: "service", title: "service"},
  ],
};

module.exports = { jsonToCsv, csvHeaders };

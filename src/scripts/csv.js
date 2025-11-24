function convert_to_csv(array) {
  const headers = Object.keys(array[0]);
  const lines = [headers.join(","), ...array.map(row => headers.map(key => JSON.stringify(row[key] ?? "")).join(","))];
  const csv = lines.join("\n");
  return csv;
}

function download_csv(text, filename = `${new Date().toLocaleDateString()} - Transactions`) {
  if (Array.isArray(text)) text = convert_to_csv(text);
  const blob = new Blob([text], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default {
  convert: convert_to_csv,
  download: download_csv,
};

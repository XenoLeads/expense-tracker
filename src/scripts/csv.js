function convert_to_csv(array) {
  const headers = Object.keys(array[0]);
  const lines = [headers.join(","), ...array.map(row => headers.map(key => JSON.stringify(row[key] ?? "")).join(","))];
  const csv = lines.join("\n");
  return csv;
}

function export_csv(text, file_name = null) {
  if (Array.isArray(text)) text = convert_to_csv(text);
  const blob = new Blob([text], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  if (!file_name) file_name = `${format_time(new Date())} - Transactions`;
  a.download = file_name;
  a.click();
  URL.revokeObjectURL(url);

  function format_time(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${year}/${month}/${day} - ${hours}:${minutes}`;
  }
}

export default {
  convert: convert_to_csv,
  export: export_csv,
};

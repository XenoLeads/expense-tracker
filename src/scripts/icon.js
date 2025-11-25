function get_transaction_icon(transaction_type, icon_name) {
  if (["default", "other"].includes(icon_name)) icon_name = transaction_type;

  return import(`../assets/icons/transaction-category/${transaction_type}/${icon_name}.svg`).then(module => {
    return module.default;
  });
}

async function import_icon(relative_icon_path) {
  try {
    return await import(`../assets/icons/${relative_icon_path}`).then(module => module.default);
  } catch (error) {
    return null;
  }
}

export default {
  get: get_transaction_icon,
  import: import_icon,
};

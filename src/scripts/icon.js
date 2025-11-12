function get_transaction_icon(transaction_type, icon_name) {
  if (["default", "other"].includes(icon_name)) icon_name = transaction_type;

  return import(`../assets/icons/transaction-category/${transaction_type}/${icon_name}.svg`).then(module => {
    return module.default;
  });
}

export default {
  get: get_transaction_icon,
};

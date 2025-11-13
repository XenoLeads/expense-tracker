import Transaction from "./transaction.js";
import Utils from "./utils.js";

function Tracker(transactions) {
  const tracker = {
    income: 0,
    expense: 0,
  };

  refresh_transactions(tracker, transactions);

  function refresh_transactions(tracker, transactions) {
    transactions.forEach(transaction => {
      let amount = parseFloat(transaction.amount);
      if (transaction.currency !== "usd") amount = Utils.convert_to_usd(transaction.currency, transaction.amount);
      transaction.type === "income" ? (tracker.income += amount) : (tracker.expense += amount);
    });
  }

  return {
    get balance() {
      return tracker.income - tracker.expense;
    },
    get income() {
      return tracker.income;
    },
    get expense() {
      return tracker.expense;
    },
  };
}

const tracker = Tracker(Transaction.get());

export default tracker;

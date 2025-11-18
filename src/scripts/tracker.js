import Transaction from "./transaction.js";
import Utils from "./utils.js";

function Tracker(transactions) {
  const tracker = {
    income: 0,
    expense: 0,
  };

  refresh_transactions(tracker, transactions);

  function refresh_transactions(tracker, transactions) {
    tracker.income = 0;
    tracker.expense = 0;
    transactions.forEach(transaction => {
      let amount = parseFloat(transaction.amount);
      if (transaction.currency !== "usd") amount = Utils.convert_currency(transaction.amount, transaction.currency, "usd");
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
    recalculate() {
      refresh_transactions(tracker, transactions);
      return {
        balance: tracker.income - tracker.expense,
        income: tracker.income,
        expense: tracker.expense,
      };
    },
  };
}

const tracker = Tracker(Transaction.get());

export default tracker;

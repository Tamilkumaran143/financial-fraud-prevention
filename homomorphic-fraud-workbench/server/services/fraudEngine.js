const highRiskMerchants = ['ShadowPay', 'RiskyMart', 'PhantomExchange', 'DarkWallet'];

const detectFraud = (transaction, recentTransactions) => {
  const issues = [];
  const amount = Number(transaction.amount);

  if (amount > 50000) {
    issues.push('High amount transaction');
  }

  const recentCount = recentTransactions.filter((item) => {
    if (!item.created_at) return false;
    const diff = new Date(transaction.created_at).getTime() - new Date(item.created_at).getTime();
    return diff > 0 && diff <= 10 * 60 * 1000;
  }).length;

  if (recentCount >= 5) {
    issues.push('More than 5 transactions in 10 minutes');
  }

  const recentLocations = recentTransactions
    .filter((item) => item.location && item.id !== transaction.id)
    .filter((item) => {
      const diff = Math.abs(new Date(transaction.created_at).getTime() - new Date(item.created_at).getTime());
      return diff <= 60 * 60 * 1000;
    })
    .map((item) => item.location);

  if (transaction.location && recentLocations.includes(transaction.location)) {
    // no extra risk if repeated same location, skip
  }

  if (recentLocations.length >= 2) {
    issues.push('Transactions from multiple locations within one hour');
  }

  if (highRiskMerchants.includes(transaction.merchant)) {
    issues.push('High-risk merchant detected');
  }

  let score = 0;
  if (issues.length > 0) score = Math.min(100, issues.length * 35 + amount / 1000);
  const riskLevel = score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';

  return { score, riskLevel, issues };
};

module.exports = { detectFraud };

export function getDuplicatedOrders(orders) {
  const phoneMap = new Map();

  orders.forEach((order) => {
    if (order.buyer.phone) {
      phoneMap.set(order.buyer.phone, (phoneMap.get(order.buyer.phone) || 0) + 1);
    }
  });

  // Step 2: Find duplicates
  const duplicateOrders = [];

  orders.forEach((order) => {
    if (order.buyer.phone && phoneMap.get(order.buyer.phone) > 1) {
      duplicateOrders.push(order);
    }
  });

  // Log duplicate orders grouped by buyer.phone
  const groupedDuplicates = duplicateOrders.reduce((acc, order) => {
    acc[order.buyer.phone] = acc[order.buyer.phone] || [];
    acc[order.buyer.phone].push(order);
    return acc;
  }, {});
  return Object.keys(groupedDuplicates);
}

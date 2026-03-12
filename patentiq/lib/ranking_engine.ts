export type RankResult = {
  item: any;
  score: number;
  whyMatched: string[];
};

// Simple scoring weights for our demo
const FIELD_WEIGHTS: Record<string, number> = {
  title: 10,
  salary: 5,
  status: 3,
};

export function rankAndExplain(items: any[], queryConditions: any[]): RankResult[] {
  return items.map((item) => {
    let score = 0;
    const whyMatched: string[] = [];

    // Loop through conditions to see if the item matches them
    for (const condition of queryConditions) {
      const { field, operator, value } = condition;
      const itemValue = item[field];

      if (itemValue === undefined) continue;

      let matched = false;
      let reason = '';

      // Simple implementation of operators
      if (operator === '=') {
        matched = itemValue === value;
        if (matched) reason = `Exact match on ${field}: '${value}'`;
      } else if (operator === '!=') {
        matched = itemValue !== value;
        if (matched) reason = `${field} is slightly different: '${itemValue}' != '${value}'`;
      } else if (operator === '>') {
        matched = itemValue > value;
        if (matched) reason = `${field} is strictly greater than ${value} (${itemValue})`;
      } else if (operator === '<') {
        matched = itemValue < value;
        if (matched) reason = `${field} is strictly less than ${value} (${itemValue})`;
      } else if (operator === 'LIKE') {
        matched = String(itemValue).toLowerCase().includes(String(value).toLowerCase());
        if (matched) reason = `${field} contains '${value}'`;
      } else if (operator === 'IN') {
        matched = Array.isArray(value) && value.includes(itemValue);
        if (matched) reason = `${field} is one of the allowed values: [${value.join(', ')}]`;
      }

      // If matched, add points and the reason!
      if (matched) {
        score += FIELD_WEIGHTS[field] || 1; // Default to 1 point if no explicit weight
        whyMatched.push(reason);
      }
    }

    return { item, score, whyMatched };
  })
  // Filter out items that didn't match and sort them by score descending
  .filter(result => result.score > 0)
  .sort((a, b) => b.score - a.score);
}

export async function fetchPrices() {
    const res = await fetch('https://interview.switcheo.com/prices.json');
    if (!res.ok) throw new Error('Failed to fetch prices');
    const data = await res.json();
    const map: Record<string, number> = {};
    for (const item of data) {
        if (item.currency && item.price) {
            map[item.currency.toUpperCase()] = Number(item.price);
        }
    }
    return map;
}

export const tokenIconUrl = (currency: string) =>
    `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency.toUpperCase()}.svg`;

/**
 * @file src/mocks/index.ts
 * @description Barrel export para todos los datos mock y utilidades de simulación.
 */

export { f } from './seed';
export { MOCK_ORGANIZATIONS } from './generators/organizations';
export { MOCK_MYPES } from './generators/mypes';
export { MOCK_DONORS } from './generators/donors';
export { MOCK_DONATIONS } from './generators/donations';
export { MOCK_EVENTS } from './generators/events';
export { MOCK_SUPPLY_ITEMS, getSupplyItemsByEvent } from './generators/supplyBags';
export { MOCK_TRANSACTIONS, MOCK_FUND_BALANCES, calculateFundBalances } from './generators/transactions';
export { MOCK_NOTIFICATIONS } from './generators/notifications';

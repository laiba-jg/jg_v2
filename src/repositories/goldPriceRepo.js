import GoldPriceModal from '../models/GoldPriceModal.js';

export const getLatestGoldPrice = async () => GoldPriceModal.findOne().sort({ timestamp: -1 });
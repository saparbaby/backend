const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [String], // Массив URL изображений
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Создатель
});

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);

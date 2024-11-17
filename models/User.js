const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Определение схемы пользователя
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' }
});

// Хэширование пароля перед сохранением
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Экспорт модели
module.exports = mongoose.model('User', userSchema);

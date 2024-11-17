const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { ensureRole } = require('./utils/auth');
const { sendWelcomeEmail } = require('./utils/nodemailer');
const User = require('./models/User');
const PortfolioItem = require('./models/PortfolioItem');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(express.static('public'));

// EJS
app.set('view engine', 'ejs');


// Главная страница
app.get('/', async (req, res) => {
    const portfolioItems = await PortfolioItem.find();
    res.render('main', { user: req.session.user || null, portfolioItems });
});

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Устанавливает user для всех шаблонов
    next();
});


// Регистрация
app.get('/register', (req, res) => res.render('register', { user: null }));
app.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, age, gender, email } = req.body;

        const newUser = new User({
            username,
            password,
            firstName,
            lastName,
            age,
            gender,
            email,
        });

        await newUser.save();

        // Отправка приветственного письма
        await sendWelcomeEmail(email, firstName);

        res.redirect('/login');
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).send('Registration failed');
    }
});

// Логин
app.get('/login', (req, res) => res.render('login', { user: null }));
app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials');
        }

        // Сохраняем роль пользователя в базе данных
        if (role !== user.role) {
            user.role = role;
            await user.save();
        }

        // Сохраняем данные пользователя в сессии
        req.session.user = {
            _id: user._id,
            username: user.username,
            role: user.role, // Устанавливаем роль
        };

        // Перенаправляем в зависимости от роли
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else if (user.role === 'editor') {
            res.redirect('/editor/panel');
        } else {
            res.status(403).send('Access denied');
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Error during login');
    }
});


app.get('/logout', (req, res) => {
    // Удаление данных сессии
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Error logging out');
        }
        // Перенаправление на главную страницу
        res.redirect('/');
    });
});


// Панель администратора
app.get('/admin', ensureRole('admin'), async (req, res) => {
    console.log('User session:', req.session.user); // Для проверки роли пользователя

    try {
        const portfolioItems = await PortfolioItem.find({});
        res.render('admin', {
            user: req.session.user,
            portfolioItems,
        });
    } catch (err) {
        console.error('Error loading admin panel:', err);
        res.status(500).send('Error loading admin panel');
    }
});


// Панель редактора
app.get('/editor/panel', ensureRole('editor'), async (req, res) => {
    try {
        // Получение только тех элементов, которые создал редактор
        const portfolioItems = await PortfolioItem.find({ createdBy: req.session.user._id });

        // Рендеринг шаблона editor.ejs с передачей данных
        res.render('editor', { user: req.session.user, portfolioItems });
    } catch (err) {
        console.error('Error fetching portfolio items for editor:', err);
        res.status(500).send('Error loading editor panel');
    }
});



app.post('/portfolio/create', ensureRole('editor'), async (req, res) => {
    try {
        const { title, description, images } = req.body;
        const newItem = new PortfolioItem({
            title,
            description,
            images: images.split(','),
        });
        await newItem.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error creating portfolio item:', err);
        res.status(500).send('Failed to create item');
    }
});


// Панель администратора
app.get('/admin', ensureRole('admin'), async (req, res) => {
    const portfolioItems = await PortfolioItem.find();
    res.render('admin', { user: req.session.user, portfolioItems });
});

app.post('/portfolio/create', ensureRole('admin'), async (req, res) => {
    try {
        const { title, description, images } = req.body;

        // Проверка обязательных полей
        if (!title || !description || !images) {
            return res.status(400).send('All fields (title, description, images) are required');
        }

        // Преобразование строки URL-адресов в массив
        const imageArray = images.split(',').map(url => url.trim());

        // Проверка, что массив содержит минимум одно изображение
        if (imageArray.length === 0) {
            return res.status(400).send('At least one image URL is required');
        }

        // Создание нового элемента портфолио
        const newPortfolioItem = new PortfolioItem({
            title,
            description,
            images: imageArray, // Сохраняем массив URL
            createdBy: req.session.user._id, // ID текущего пользователя
        });

        // Сохранение в базу данных
        await newPortfolioItem.save();

        console.log('Portfolio item created:', newPortfolioItem);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error creating portfolio item:', err);

        // Более детализированный ответ при ошибке
        res.status(500).send('Error creating portfolio item. Please try again later.');
    }
});



app.post('/portfolio/update/:id', ensureRole('admin'), async (req, res) => {
    try {
        const { id } = req.params; // ID элемента
        const { title, description, images } = req.body; // Получаем данные из формы

        // Проверка обязательных полей
        if (!title || !description || !images) {
            return res.status(400).send('All fields (title, description, images) are required');
        }

        // Преобразование строки URL-адресов в массив
        const imageArray = images.split(',').map(url => url.trim());

        // Проверка, что массив содержит хотя бы одно изображение
        if (imageArray.length === 0) {
            return res.status(400).send('At least one image URL is required');
        }

        // Обновление элемента в базе данных
        const updatedItem = await PortfolioItem.findByIdAndUpdate(
            id,
            { 
                title, 
                description, 
                images: imageArray, // Обновляем массив изображений
                updatedAt: new Date() // Обновляем временную метку
            },
            { new: true } // Возвращает обновлённый объект
        );

        if (!updatedItem) {
            return res.status(404).send('Portfolio item not found');
        }

        console.log('Portfolio item updated:', updatedItem);
        res.redirect('/admin'); // Перенаправление обратно на панель администратора
    } catch (err) {
        console.error('Error updating portfolio item:', err);
        res.status(500).send('Error updating portfolio item');
    }
});






app.post('/portfolio/delete/:id', ensureRole('admin'), async (req, res) => {
    try {
        await PortfolioItem.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error deleting portfolio item:', err);
        res.status(500).send('Failed to delete item');
    }
});


app.get('/image-proxy', async (req, res) => {
    const imageUrl = req.query.url;
    try {
        const response = await axios.get(imageUrl, { responseType: 'stream' });
        response.data.pipe(res);
    } catch (err) {
        console.error('Image proxy error:', err);
        res.status(500).send('Error loading image');
    }
});



//Api 
app.get('/api/currency', async (req, res) => {
    try {
        const response = await axios.get(
            'https://v6.exchangerate-api.com/v6/b5727d78d9fb0b2ab846b53a/latest/USD'
        );
        res.json(response.data); // Отправляем данные клиенту
    } catch (error) {
        console.error('Error fetching currency data:', error.message);
        res.status(500).send('Error fetching currency data');
    }
});


app.get('/visualization/currency', (req, res) => {
    res.render('currencyVisualization');
});

app.get('/api/crypto', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd', // Валюта
                order: 'market_cap_desc', // По рыночной капитализации
                per_page: 5, // Количество криптовалют
                page: 1,
            },
        });
        res.json(response.data); // Отправляем данные на клиент
    } catch (error) {
        console.error('Error fetching crypto data:', error.message);
        res.status(500).send('Error fetching crypto data');
    }
});

app.get('/visualization/crypto', (req, res) => {
    res.render('cryptoVisualization', { user: req.session.user || null });
});


// Запуск сервера
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

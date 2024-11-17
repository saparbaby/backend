### README.md

# **Astana Portfolio Platform**

A web-based portfolio management system designed for showcasing items and integrating dynamic data from external APIs. The application features user authentication and role-based access, allowing admins and editors to manage portfolio items and visualizations effectively.

---

## **Features**

### **Authentication & Authorization**
- User roles: 
  - **Admin**: Full access to manage portfolio items and API visualizations.
  - **Editor**: Limited access to add portfolio items and view visualizations.
- Secure registration and login with hashed passwords using `bcrypt`.
- Welcome email upon successful registration (via `Nodemailer`).

### **Portfolio Management**
- Create, update, and delete portfolio items (Admins only).
- Display of portfolio items with:
  - A title, description, and timestamps.
  - A carousel showcasing three images.
- Editor access to create items but without edit/delete permissions.

### **API Integration**
- **Currency Exchange Rates**: Real-time data using [ExchangeRate-API](https://www.exchangerate-api.com/).
- **Crypto Market Data**: Top cryptocurrencies fetched from [CoinGecko API](https://www.coingecko.com/).
- Data visualizations using `Chart.js`.

### **Responsive Design**
- Optimized for desktop and mobile.
- Stylish and intuitive UI created with custom CSS.

---

## **Project Structure**

```
astana-portfolio/
├── models/
│   ├── User.js              # User schema and authentication logic
│   └── PortfolioItem.js     # Portfolio item schema
├── public/
│   ├── css/
│   │   └── styles.css       # Styling for the application
│   ├── js/
│         ├── carousel.js      # Logic for portfolio carousel
│         └── cryptoVisualization.js       # Fetch and display API data 
│         └── currencyVisualization.js
├── views/
│   ├── partials/            # Navbar and footer components
│   ├── admin.ejs            # Admin panel
│   ├── editor.ejs           # Editor panel
│   ├── home.ejs             # Main page
│   ├── login.ejs            # Login page
│   ├── register.ejs         # Registration page
│   ├── currencyVisualization.ejs # Currency visualization page
│   └── cryptoVisualization.ejs   # Crypto visualization page
├── .env                     # Environment variables
├── package.json             # Dependencies
├── README.md                # Documentation
└── server.js                # Application entry point
```

---

## **Setup Instructions**

### **1. Clone the repository**
```bash
git clone <repository-link>
cd astana-portfolio
```

### **2. Install dependencies**
```bash
npm install
```

### **3. Set up environment variables**
Create a `.env` file in the root directory and include the following:
```
PORT=3000
SESSION_SECRET=saparbaby2005
MONGO_URI=mongodb+srv://dilnaz05:dlzz2510%40@cluster0.g28r8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MAIL_USER=dilnazsaparbek@gmail.com
MAIL_PASS=ppjv brgs oyhz bjvk

### **4. Start the server**
```bash
npx nodemon server.js
```

Access the application at `http://localhost:3000`.

---

## **API Endpoints**

### **Portfolio Management**
| Method | Endpoint              | Description                           |
|--------|-----------------------|---------------------------------------|
| GET    | `/admin`              | Admin panel                          |
| GET    | `/editor/panel`       | Editor panel                         |
| POST   | `/portfolio/create`   | Create a new portfolio item          |
| POST   | `/portfolio/update/:id` | Update an existing portfolio item    |
| POST   | `/portfolio/delete/:id` | Delete a portfolio item              |

### **API Data**
| Method | Endpoint        | Description                           |
|--------|-----------------|---------------------------------------|
| GET    | `/api/currency` | Fetches latest currency exchange rates |
| GET    | `/api/crypto`   | Fetches top 5 cryptocurrencies         |

---

## **Visualization Pages**

| Page                 | Description                            |
|----------------------|----------------------------------------|
| `/visualization/currency` | Displays a currency exchange chart |
| `/visualization/crypto`   | Displays a crypto market chart      |

---

## **Tech Stack**
- **Backend**: Node.js, Express.js
- **Frontend**: EJS, Chart.js, CSS
- **Database**: MongoDB (via Mongoose)
- **Email Service**: Nodemailer
- **APIs**:
  - ExchangeRate-API
  - CoinGecko API

---

## **Known Issues**
1. Ensure MongoDB Atlas allows connections from your IP.
2. Use valid API keys in `.env` for email and database setup.

---

## **Future Enhancements**
- Add additional visualizations for stock market data.
- Implement user profile pages.
- Enhance mobile responsiveness.

---

import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import authorsRoutes from './routes/authorsRoutes.js';
import editorialRoutes from './routes/editorialRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import typeRoutes from './routes/typeRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import errorHandler from './middleware/errorHandler.js'
import cors from 'cors';

const app = express()
const port = 3000

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Auth routes
app.use('/api/auth', authRoutes);
//Products routes
app.use('/api/products', productsRoutes);
//Author routes
app.use('/api/authors', authorsRoutes);
//Editorial routes
app.use('/api/editorials', editorialRoutes);
//Category routes
app.use('/api/categories', categoryRoutes);
//Type routes
app.use('/api/types', typeRoutes);
//Cart routes
app.use('/api/cart', cartRoutes);
//order Routes
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

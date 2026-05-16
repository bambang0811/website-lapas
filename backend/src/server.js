import app from "./app.js";

app.use(cors({
  origin: [
    'https://lapaskarawang.page.gd',
    'http://localhost:5173'
  ],
  credentials: true
}));
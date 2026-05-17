app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

app.use("/api/berita", beritaRoutes);
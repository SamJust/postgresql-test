const app = require('./config/app');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Ana giriş noktanız
  output: {
    filename: 'main.js', // Oluşturulan dosyanın adı
    path: path.resolve(__dirname, 'dist'), // Çıktı dizini
    publicPath: '/', // Web sunucusu içindir, genellikle "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/, // JavaScript dosyaları için
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Babel kullanarak dönüştür
          options: {
            presets: ['@babel/preset-env'], // Babel env ön ayarları kullan
          },
        },
      },
      {
        test: /\.css$/, // CSS dosyaları için
        use: ['style-loader', 'css-loader'], // Stil loader ve CSS loader kullan
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // HTML dosyası için şablon
      title: 'Todo App', // Başlık ekle (isteğe bağlı)
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Sunucu için statik dosya dizini
    },
    open: true, // Sunucu başlatıldığında tarayıcıda aç
  },
  mode: 'development', // Geliştirme modu
};

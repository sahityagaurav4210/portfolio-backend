const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@config': path.resolve(__dirname, 'src/config/'),
      '@models': path.resolve(__dirname, 'src/models/'),
      '@controllers': path.resolve(__dirname, 'src/controllers/'),
      '@db': path.resolve(__dirname, 'src/db/'),
      '@helpers': path.resolve(__dirname, 'src/helpers/'),
      '@decorators': path.resolve(__dirname, 'src/decorators/'),
      '@routes': path.resolve(__dirname, 'src/routes/'),
      '@middlewares': path.resolve(__dirname, 'src/middlewares/'),
      '@types': path.resolve(__dirname, 'src/types/'),
      '@api': path.resolve(__dirname, 'src/api/'),
      '@packages': path.resolve(__dirname, 'src/packages/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
    ],
  },
  target: 'node',
  externals: [nodeExternals()], // Ignore node_modules dependencies
};

const path = require('path')
module.exports = {
  entry: path.join(__dirname, 'src/js', 'App.js'),
  devServer: {
    contentBase: path.join(__dirname, 'src'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader','css-loader'],
        include: [/src/, /node_modules/]
      }, {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      }, {
        test: /\.json$/,
        loader: 'json-loader',
        include: '/build/contracts/'
      }
    ]
  }
}

//트러플에 의해 노출되는 계약 디렉터리 지정함.
//버전의 웹팩에는 json 로더가 기본적으로 포함되어 있음
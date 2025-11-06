const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const createConfig = (isProduction) => {
  const mode = isProduction ? 'production' : 'development';
  const suffix = isProduction ? '.min' : '';

  return {
    mode: mode,
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist/umd'), 
      filename: `clara-ui${suffix}.js`,
      library: {
        name: 'ClaraUI',
        type: 'umd',
        umdNamedDefine: true,
      },
      globalObject: 'this',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM',
      },
    },
    plugins: [
      new CleanWebpackPlugin(), 
      new MiniCssExtractPlugin({
        filename: `clera-ui${suffix}.css`,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/,
          type: 'asset/inline',
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          extractComments: /LICENSE\.txt/i,
        }),
        new CssMinimizerPlugin(),
      ],
    },
  };
};

module.exports = [
  createConfig(false),
  createConfig(true),
];
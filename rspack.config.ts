import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  entry: {
    index: './src/index.tsx',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      scriptLoading: 'defer',
      chunks: ['index'],
    }),
    isDev ? new ReactRefreshPlugin() : null,
  ].filter(Boolean),
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: [
                  'chrome >= 87',
                  'edge >= 88',
                  'firefox >= 78',
                  'safari >= 14',
                ],
              },
            },
          },
        ],
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        type: 'css',
      },
      {
        test: /\.module\.css$/,
        type: 'css',
        generator: {
          localIdentName: '[local]',
        },
      },
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /winbox.*\.js$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/js/winbox.min.js',
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[contenthash:8].js',
    cssFilename: 'static/css/[name].[contenthash:8].css',
    clean: true,
  },
  devServer: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    open: false,
    hot: true,
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      hidePathInfo: true,
      maxInitialRequests: 20,
      maxAsyncRequests: 20,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  stats: {
    preset: 'normal',
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [fileURLToPath(import.meta.url)],
    },
  },
});

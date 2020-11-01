const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'my-webpack-bundle.js'
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
			{ test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] },
			{ test: /\.hbs$/, exclude: /node_modules/, use: ['handlebars-loader'] },
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				loader: 'file-loader',
				options: {
					outputPath: 'images',
					name: '[name].[ext]',
				},
			},
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({ template: './src/index.html' }),
		new MiniCssExtractPlugin({ filename: "style.css" }),
	],
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 2013
	}
};
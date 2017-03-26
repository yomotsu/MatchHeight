import babel from 'rollup-plugin-babel'

const license = `/*!
 * @author yomotsu
 * MatchHeight
 * https://github.com/yomotsu/MatchHeight
 * Released under the MIT License.
 */`

export default {
	entry: './src/main.js',
	indent: '\t',
	sourceMap: false,
	plugins: [
		babel( {
			exclude: 'node_modules/**',
			presets: [
				[ 'env', {
					targets: {
						browsers: [
							'last 2 versions',
							'ie >= 9'
						]
					},
					loose: true,
					modules: false
				} ]
			]
		} )
	],
	targets: [
		{
			format: 'umd',
			moduleName: 'MatchHeight',
			dest: 'dist/MatchHeight.js',
			banner: license
		},
		{
			format: 'es',
			dest: 'dist/MatchHeight.module.js',
			banner: license
		}
	]
};

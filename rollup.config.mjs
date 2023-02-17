import pkg from './package.json' assert { type: "json" };
import typescript from 'typescript';
import rollupTypescript from '@rollup/plugin-typescript';

const license = `/*!
 * @author yomotsu
 * MatchHeight
 * https://github.com/yomotsu/MatchHeight
 * Released under the MIT License.
 */`;

export default {
	input: './src/main.ts',
	output: [
		{
			format: 'umd',
			name: 'MatchHeight',
			file: pkg.main,
			banner: license,
			indent: '\t',
		},
		{
			format: 'es',
			file: pkg.module,
			banner: license,
			indent: '\t',
		}
	],
	plugins: [
		rollupTypescript( { typescript } ),
	],
};

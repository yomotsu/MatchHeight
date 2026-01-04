import { readFileSync } from 'fs';
import typescript from 'typescript';
import rollupTypescript from '@rollup/plugin-typescript';

const pkg = JSON.parse( readFileSync( './package.json', 'utf-8' ) );

const license = `/*!
 * @author yomotsu
 * MatchHeight
 * https://github.com/yomotsu/MatchHeight
 * Released under the MIT License.
 */`;

export default {
	input: './src/match-height.ts',
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

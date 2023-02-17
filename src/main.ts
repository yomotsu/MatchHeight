import throttle from './throttle.js';
import MatchHeight from './MatchHeight.js';

const throttledUpdate = throttle( MatchHeight.update, 200 );

window.addEventListener( 'DOMContentLoaded', function onDomReady() {

	MatchHeight.init();
	window.removeEventListener( 'DOMContentLoaded', onDomReady );

} );
window.addEventListener( 'load', function onLoad() {

	MatchHeight.update();
	window.removeEventListener( 'load', onLoad );

} );

window.addEventListener( 'resize', throttledUpdate );

export default MatchHeight;

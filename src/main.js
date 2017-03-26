import throttle from './throttle.js';
import MatchHeight from './MatchHeight.js';

const throttledUpdate = throttle( MatchHeight.update, 200 );

MatchHeight.init();
window.addEventListener( 'resize', throttledUpdate );

export default MatchHeight;

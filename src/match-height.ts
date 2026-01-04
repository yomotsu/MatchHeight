import throttle from './throttle';

type Item = {
	el: HTMLElement;
	top: number;
	height: number;
}

const errorThreshold = 1; // in px

class MatchHeight {

	private _selector: string;
	private _remains: Item[] = [];
	disconnect: () => void;

	constructor( selector: string = '[data-mh]' ) {

		this._selector = selector;

		const update = this.update.bind( this );
		const throttledUpdate = throttle( update, 200 );

		if ( document.readyState === 'loading' ) {

			document.addEventListener( 'DOMContentLoaded', update, { once: true } );

		} else if ( document.readyState === 'interactive' ) {

			document.addEventListener( 'load', update, { once: true } );

		} else {

			update();

		}

		window.addEventListener( 'resize', throttledUpdate );

		this.disconnect = () => {

			window.removeEventListener( 'resize', throttledUpdate );

		}

	}

	update() {

		const elements = document.querySelectorAll( this._selector );

		if ( elements.length === 0 ) return;

		this._remains = Array.prototype.map.call( elements, ( el: HTMLElement ): Item => {

			return {
				el,
				top: 0,
				height: 0,
			};

		} ) as Item[];
		// remove all height before
		this._remains.forEach( ( item ) => {

			item.el.style.minHeight = '';

		} );

		this._process();

	}

	private _process() {

		this._remains.forEach( ( item ) => {

			const bb = item.el.getBoundingClientRect();

			item.top    = bb.top;
			item.height = bb.height;

		} );

		this._remains.sort( ( a, b ) => a.top - b.top );

		const processingTop = this._remains[ 0 ].top;
		const processingTargets = this._remains.filter( item => Math.abs( item.top - processingTop ) <= errorThreshold );
		const maxHeightInRow = Math.max( ...processingTargets.map( ( item ) => item.height ) );

		processingTargets.forEach( ( item ) => {

			const error = processingTop - item.top + errorThreshold;
			const styles = window.getComputedStyle( item.el );
			const isBorderBox = styles.boxSizing === 'border-box';

			if ( isBorderBox ) {

					item.el.style.minHeight = `${ maxHeightInRow + error }px`;

			} else {
				const paddingAndBorder =
					( parseFloat( styles.paddingTop ) || 0 ) +
					( parseFloat( styles.paddingBottom ) || 0 ) +
					( parseFloat( styles.borderTopWidth ) || 0 ) +
					( parseFloat( styles.borderBottomWidth ) || 0 );
				item.el.style.minHeight = `${ maxHeightInRow - paddingAndBorder + error }px`;
			}

		} );

		this._remains.splice( 0, processingTargets.length );

		if ( 0 < this._remains.length ) this._process();

	}

}

export default MatchHeight;

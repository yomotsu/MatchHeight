const errorThreshold = 1; // in px
let initialized = false;
let elements;
let remains;

const MatchHeight = {

	init() {

		initialized = true;
		elements = document.querySelectorAll( '[data-mh]' );
		MatchHeight.update();

	},

	update() {

		if ( ! initialized ) {

			MatchHeight.init();
			return;

		}

		if ( elements.length === 0 ) return;

		remains = Array.prototype.map.call( elements, ( el ) => {

			return { el: el };

		} );
		// remove all height before
		remains.forEach( ( item ) => {

			item.el.style.minHeight = '';

		} );
		process();

	}

};

function process() {

	remains.forEach( ( item ) => {

		const bb = item.el.getBoundingClientRect();

		item.top    = bb.top;
		item.height = bb.height;

	} );

	remains.sort( ( a, b ) => a.top - b.top );

	const processingTop = remains[ 0 ].top;
	const processingTargets = remains.filter( item => Math.abs( item.top - processingTop ) <= errorThreshold );
	const maxHeightInRow = Math.max( ...processingTargets.map( ( item ) => item.height ) );

	processingTargets.forEach( ( item ) => {

		const error = processingTop - item.top + errorThreshold;
		const paddingAndBorder =
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'padding-top' ),         10 ) +
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'padding-bottom' ),      10 ) +
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'border-top-width' ),    10 ) +
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'border-bottom-width' ), 10 );
		item.el.style.minHeight = `${ maxHeightInRow - paddingAndBorder + error }px`;

	} );

	remains.splice( 0, processingTargets.length );

	if ( 0 < remains.length ) process();

}

export default MatchHeight;

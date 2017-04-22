let elements;
let remains;

const MatchHeight = {

	init () {

		elements = document.querySelectorAll( '[data-mh]' );
		this.update();

	},

	update () {

		if ( elements.length === 0 ) { return; }

		remains = Array.prototype.map.call( elements, ( el ) => { return { el: el }; } );
		// remove all height before
		remains.forEach( ( item ) => { item.el.style.minHeight = 'auto'; } );
		process();

	}

};

function process() {

	remains.forEach( ( item ) => {

		const bb = item.el.getBoundingClientRect();

		item.top    = bb.top;
		item.height = bb.height;

	} );

	remains.sort( ( a, b ) => { return a.top - b.top } );
	const processingTop = remains[ 0 ].top;
	const processingTargets = remains.filter( item => item.top === processingTop );
	const maxHeightInRow = processingTargets.reduce( ( max, item ) => Math.max( max, item.height ), 0 );

	processingTargets.forEach( ( item ) => {

		const paddingAndBorder = 
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'padding-top' ), 10 ) +
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'padding-bottom' ), 10 ) +
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'border-top-width' ), 10 ) +
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'border-bottom-width' ), 10 );
		item.el.style.minHeight = ( maxHeightInRow - paddingAndBorder ) + 'px';

	} );

	remains.splice( 0, processingTargets.length );

	if ( 0 < remains.length ) process();

}

export default MatchHeight;

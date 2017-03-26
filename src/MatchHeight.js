let elements;
let remains;

const MatchHeight = {

	init () {

		elements = document.querySelectorAll( '[data-mh]' );
		this.update();

	},

	update () {

		remains = Array.prototype.map.call( elements, ( el ) => { return { el: el }; } );
		// remove all height before
		remains.forEach( ( item ) => { item.el.style.minHeight = 'auto'; } );
		prosess();

	}

};

function prosess() {

	remains.forEach( ( item ) => {

		const bb = item.el.getBoundingClientRect();

		item.top    = bb.top;
		item.height = bb.height;

	} );

	remains.sort( ( a, b ) => { return a.top - b.top } );
	const prosessingTop = remains[ 0 ].top;
	const prosessingTargets = remains.filter( item => item.top === prosessingTop );
	const maxHeightInRow = prosessingTargets.reduce( ( max, item ) => Math.max( max, item.height ), 0 );

	prosessingTargets.forEach( ( item ) => {

		const paddingAndBorder = 
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'padding-top' ), 10 ) +
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'padding-bottom' ), 10 ) +
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'border-top-width' ), 10 ) +
			parseFloat( window.getComputedStyle( item.el ).getPropertyValue( 'border-bottom-width' ), 10 );
		item.el.style.minHeight = ( maxHeightInRow - paddingAndBorder ) + 'px';

	} );

	remains.splice( 0, prosessingTargets.length );

	if ( 0 < remains.length ) prosess();

}

export default MatchHeight;

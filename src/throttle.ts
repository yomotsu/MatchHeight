function throttle( fn: () => void, threshold: number ) {

	let last: number, deferTimer: number;

	return function () {

		const now = Date.now();

		if ( last && now < last + threshold ) {

			clearTimeout( deferTimer );
			deferTimer = setTimeout( function () {

				last = now;
				fn();

			}, threshold );

		} else {

			last = now;
			fn();

		}

	};

}

export default throttle;

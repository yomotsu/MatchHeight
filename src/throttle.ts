export default function throttle<T extends (...args: any[]) => void>( fn: T, threshold: number ) {

	let last: number | undefined;
	let deferTimer: ReturnType<typeof setTimeout> | undefined;

	return function ( ...args: Parameters<T> ) {

		const now = Date.now();

		if ( last !== undefined && now < last + threshold ) {

			clearTimeout( deferTimer );
			deferTimer = setTimeout( () => {
				last = now;
				fn( ...args );
			}, threshold );

		} else {

			last = now;
			fn( ...args );

		}

	};

}

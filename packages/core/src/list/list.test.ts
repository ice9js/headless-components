import {
	initializeList,
	getListItems,
} from '.';

test( 'initializeList() should fail if items are not of the same type', () => {
	const items = [ 'foo', 123, false ];

	initializeList( items );
} );

test( 'initializeList() should return a List<T> object containing the passed items', () => {
	const items = [ 'foo', 'bar', 'baz' ];
	const list = initializeList( items );

	expect( getListItems( list ) ).toEqual( items );
} );

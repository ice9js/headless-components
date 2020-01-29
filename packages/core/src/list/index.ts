export type List<T> = {
	currentIndex: number,
	items: Array<T>,
	isCircular: boolean,
};

export const initializeList = <T>( items: Array<T>, isCircular = false ): List<T> => ( {
	currentIndex: 0,
	items,
	isCircular, // make that into another wrapper (CircularList) type
} );

export const getListItems = <T>( list: List<T> ): Array<T> => list.items;

export const getListItem = <T>( list: List<T>, index: number ): T => getListItems( list )[ index ];

export const getListLength = <T>(list: List<T>): number => getListItems(list).length;

export const getFirstListItem = <T>(list: List<T>): T => getListItem(list, 0);

export const getLastListItem = <T>(list: List<T>): T => getListItem(list, getListLength(list) - 1);

export const getCurrentListIndex = <T>(list: List<T>): number => list.currentIndex;

export const getCurrentListItem = <T>(list: List<T>): T => getListItem(list, getCurrentListIndex(list));

export const isFirstListItem = <T>(list: List<T>, item: T): boolean => getFirstListItem(list) === item;

export const isLastListItem = <T>(list: List<T>, item: T): boolean => getLastListItem(list) === item;

export const isCurrentListItem = <T>(list: List<T>, item: T): boolean => getCurrentListItem(list) === item;

export const isCircularList = <T>(list: List<T>): boolean => list.isCircular;

export const setCurrent = <T>(list: List<T>, index: number): List<T> => {
	if (!getListItem(list, index)) {
		throw new Error(`Invalid list index: ${index}`);
	}

	if (getListItem(list, index) === getCurrentListItem(list)) {
		return list;
	}

	return {
		...list,
		currentIndex: index,
	};
};

export const next = <T>(list: List<T>): List<T> => {
	if (!list.isCircular && isLastListItem(list, getCurrentListItem(list))) {
		throw new Error(`Cannot iterate past the end of the collection`);
	}

	return ({
		...list,
		currentIndex: isLastListItem(list, getCurrentListItem(list)) ? 0 : getCurrentListIndex(list) + 1,
	});
};

export const previous = <T>(list: List<T>): List<T> => {
	if (!list.isCircular && isFirstListItem(list, getCurrentListItem(list))) {
		throw new Error(`Cannot rewind pas the beginning of the collection`);
	}

	return ({
		...list,
		currentIndex: (isFirstListItem(list, getCurrentListItem(list)) ? getListLength(list) : getCurrentListIndex(list)) - 1,
	});
};

import {
	List,
	current,
	listItem,
	next as nextListItem,
	previous as previousListItem,
	setCurrent
} from 'headless-ui/core/list';

type Dropdown<T> {
	isOpen: boolean,
	selected: number,
	list: List<T>
};

export const initializeDropdown = (options: Array<T>, defaultSelected?: T): Dropdown<T> => ( {
	isOpen: false,
	selected: 
} );

/**
 * Returns true when the dropdown is open.
 */
export const isOpen = (dropdown: Dropdown<T>): boolean => dropdown.isOpen;

/**
 * Returns the dropdown item for the given index
 */
export const dropdownItem = (dropdown: Dropdown<T>, index: number): T => listItem(dropdown.list, index);

/**
 * Returns the active/highlighted item inside the dropdown
 */
export const active = (dropdown: Dropdown<T>): T => current(dropdown.list);

/**
 * Returns the currently selected value for the dropdown
 */
export const selected = (dropdown: Dropdown<T>): T => dropdownItem(dropdown, dropdown.selected);

/**
 * Returns true if the given element is currently active/highlighted
 */
export const isActive = (dropdown: Dropdown<T>, item: T): T => active(dropdown) === item;

/**
 * Returns true if the given element is currently selected
 */
export const isSelected = (dropdown: Dropdown<T>, item: T): T => selected(dropdown) === item;

export const toggle = (dropdown: Dropdown<T>): Dropdown<T> => ({
	...dropdown,
	isOpen: ! dropdown.isOpen,
});

export const open = (dropdown: Dropdown<T>): Dropdown<T> =>
	isOpen(dropdown) ? dropdown : toggle(dropdown);

export const close = (dropdown: Dropdown<T>): Dropdown<T> =>
	isOpen(dropdown) ? toggle(dropdown) : dropdown;

export const setActive = (dropdown: Dropdown<T>, index: number): Dropdown<T> =>
	setCurrent(dropdown.list, index);

export const next = (dropdown: Dropdown<T>): Dropdown<T> => ({
	...dropdown,
	list: nextListItem(dropdown.list),
});

export const previous = (dropdown: Dropdown<T>): Dropdown<T> => ({
	...dropdown,
	list: previousListItem(dropdown.list),
});

export const setSelected = (dropdown: Dropdown<T>, index: number): Dropdown<T> => {
	if (!dropdownItem(dropdown, index)) {
		throw new Error(`Invalid index`);
	}

	if (dropdownItem(dropdown, index) === selected(dropdown)) {
		return;
	}

	return {
		...dropdown,
		selected: index,
	};
};

export const selectActiveDropdownItem = (dropdown: Dropdown<T>): Dropdown<T> =>
	setSelected(dropdown, currentIndex(dropdown.list));

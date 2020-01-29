import React, { useState } from 'react';

const Dropdown = ( {  } ) => {
	const [ dropdown, setDropdown ] = useState( {
		
	} );

	const handleEscape = ( event ) => event.keyCode === 27 && isOpen( dropdown ) && setDropdown( close( dropdown ) );

	useEffect( () => {
		document.addEventListener( 'keydown', handleEscape );

		return () => {
			document.removeEventListener( 'keydown', handleEscape );
		};
	} );

	const handleToggleClick = () => setDropdown( toggle( dropdown ) );
	const handleToggleKeyPress = ( event ) => event.keyCode === 13 && setDropdown( open( dropdown ) );

	// ALso, bad idea to rely on index as that may no longer match up with the internal implementation
	// since we can have filtered items or using something entirely different inside - see if these methods can be made to work with items instead
	const handleItemHover = ( index ) => () => setDropdown( setActive( dropdown, index ) );
	const handleItemClick = ( index ) => () => setDropdown( setSelected( dropdown, index ) );
	const handleItemKeyPress = ( event ) => {
		event.keyCode === 40 && setDropdown( next( dropdown ) );
		event.keyCode === 9 && setDropdown( next( dropdown ) );
		event.keyCode === 38 && setDropdown( previous( dropdown ) );
		event.keyCode === 9 && e.shiftKey && setDropdown( previous( dropdown ) );
		// Whether it's a safe assumption to make or not - handleItemClick should follow the same convention
		event.keyCode === 13 && setDropdown( selectActiveDropdownItem( dropdown ) ); // This assumes that the enter is pressed on currently active item ?
	};

	return children( {
		dropdown,
		dropdownProps: {
			handleToggleClick,
			handleToggleKeyPress,
		},
		itemProps: {
			handleItemHover,
			handleItemClick,
			handleItemKeyPress,
		}
	} );
};

export default Dropdown;

const DropdownItem = ( { dropdown, handleItemClick, handleItemHover, handleItemKeyPress, item } ) => {
	const classes = classnames( 'dropdown__item', {
		'is-active': isActive( dropdown, item ),
	} );

	return (
		<li className="dropdown_item" onHover={ handleItemHover( item ) }>
			<button onClick={ handleItemClick( item ) } onKeyPress={ handleItemClick( item ) }>
				{ item.label }
			</button>
		</li>
	);
};

const DropdownComponent = ( { dropdown, handleToggleClick, handleToggleKeyPress } ) => {
	const classes = classnames( 'dropdown', {
		'is-active': isOpen( dropdown ),
	} );

	return (
		<div className={ classes }>
			<button onClick={ handleToggleClick } onKeyPress={ handleToggleKeyPress }>{ selected( dropdown ).label }</button>

			{ isOpen( dropdown ) && (
				<ul>
					{ children }
				</ul>
			) }
		</div>
	);
};

const MyDropdown = ( props ) => (
	<Dropdown { ...props }>
		{ ( { dropdown, dropdownProps, itemProps } ) => (
			<DropdownComponent dropdown={ dropdown } { ...dropdownProps }>
				{ map( dropdownItems(dropdown), ( item ) => (
					<DropdownItem dropdown={ dropdown } item={ item } { ...itemProps } />
				) ) }
			</DropdownComponent>
		) }
	</Dropdown>
);

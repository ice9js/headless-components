# Headless Components

This repository aim is to provide a framework-agnostic library of UI data-structures.  

The `core` library provides only the data shapes and functions that operate on them. These can be used on their own or easily extended, but eventually there'd be an array of assisting libraries that provide tighter integrations for the most popular frameworks.

The rationale behind this project:

What if we started treating UI as data.  
What if changing a thing or two inside any component's business logic was literally a matter of adding one pure function.  
What if you could use the same data structures and functions for handling application and UI state regardless of the framework or paradigm.  
What if your components would only need to worry about rendering.

Here's how I imagine that would work for writing an accessible select component:

```js
import React, { useEffect, useState } from 'react';
import {
	closeDropdown,
	createDropdown,
	highlightNextDropddownItem,
	highlightPreviousDropddownItem,
	openDropdown,
	selectDropdownOption,
	toggleDropdown
} from 'headless-components/core/dropdown';

const keycodes = {
	ENTER: 13,
	DOWN: 40,
	UP: 38,
	ESC: 27,
};

const SelectDropdown = ( { defaultValue, options, onChange } ) => {
	const [ dropdown, updateDropdown ] = useState( createDropdown( options, defaultValue ) );

	const ref = useRef();

	const handleOutsideClick = ( event ) => ! ref.contains( event target ) && updateDropdown( closeDropdown( dropdown ) );
	const handleEscape = ( event ) => event.keyCode === keycodes.ESCAPE && updateDropdown( closeDropdown( dropdown ) );

	useEffect( () => {
		document.addEventListener( 'mousedown', handleOutsideClick );
		document.addEventListener( 'keydown', handleEscape );

		return () => {
			document.removeEventListener( 'mousedown', handleOutsideClick );
			document.removeEventListener( 'keydown', handleEscape );
		};
	}, [ ref ] );

	const toggleDropdown = () => updateDropdown( toggleDropdown( dropdown ) );

	const handleButtonKeyPress = ( event ) => event.keyCode === keycodes.ENTER && updateDropdown( openDropdown( dropdown ) );

	const handleDropdownKeyPress = ( event ) => {
		event.keyCode === keycodes.DOWN && updateDropdown( highlightNextDropdownItem( dropdown ) );
		event.keyCode == keycodes.UP && updateDropdown( highlightPreviousDropdownItem( dropdown ) );
	};

	const handleSelectItem = ( option ) => () => {
		onChange( option );
		updateDropdown( closeDropdown( selectDropdownOption( option ) ) );
	};

	return (
		<div class="select-dropdown" ref={ ref }>
			<button onClick={ toggleDropdown } onKeyPress={ handleButtonKeyPress }>{ dropdown.current.label }</button>

			{ dropdown.isOpen && (
				<ul onKeyPress={ handleDropdownKeyPress }>
					{ dropdown.dropdownOptions.map( ( {
						isActive,
						option,
					} ) => (
						<li className={ { active: isActive } } onClick={ handleSelectItem( option ) }>
							{ option.label }
						</li>
					) ) }
				</ul>
			) }
		</div>
	);
};
```

Now, for most use cases tha handlers are not going to change, so we could extract them into a wrapper component in a react integration package just like so:

```js
import React, { useState } from 'react';
import { Select } from 'headless-components/react/components';
import { createDropdown } from 'headless-components/core/dropdown';

const SelectDropdown = ( { defaultValue, onChange, options } ) => {
	const [ dropdown, updateDropdown ] = useState( createDropdown( options, defaultValue ) );

	return (
		<Select dropdown={ dropdown } update={ updateDropdown } onChange={ onChange }>
			{ ( {
				current,
				dropdownOptions,
				dropdownProps,
				innerRef,
				isOpen,
				label,
				selectOption,
				toggleDropdown,
				toggleProps,
			} ) => (
				<div ref={ innerRef } className="select-dropdown">
					<button onClick={ toggleDropdown } { ...toggleProps }>{ current.label }</button>

					{ isOpen && (
						<ul { ...dropdownProps }>
							{ dropdownOptions.map( ( {
								isActive,
								option
							} ) => (
								<li className={ { active: isActive } } onClick={ selectOption( option ) }>
									{ option.label }
								</li>
							) ) }
						</ul>
					) }
				</div>
			) }
		</Select>
	);
};
```

Notice that by leaving the state outside of `<Select>` we're still able to easily add our own additional or replacement handlers for the default ones provided by the library - if for any reason we need to alter the behavior.
Or we could drop the state innside `<SelectDropdown>` and provide `<Select>` with `defaultValue` and `options` instead of `dropdown` and `updateDropdown` in case we don't care:

```js
import React, { useState } from 'react';
import { Select } from 'headless-components/react/components';
import { createDropdown } from 'headless-components/core/dropdown';

const SelectDropdown = ( { defaultValue, onChange, options } ) => (
	<Select defaultValue={ defaultValue } options={ options } onChange={ onChange }>
		{ ( {
			current,
			dropdownOptions,
			dropdownProps,
			innerRef,
			isOpen,
			label,
			selectOption,
			toggleDropdown,
			toggleProps,
		} ) => (
			<div ref={ innerRef } className="select-dropdown">
				<button onClick={ toggleDropdown } { ...toggleProps }>{ current.label }</button>

				{ isOpen && (
					<ul { ...dropdownProps }>
						{ dropdownOptions.map( ( {
							isActive,
							option
						} ) => (
							<li className={ { active: isActive } } onClick={ selectOption( option ) }>
								{ option.label }
							</li>
						) ) }
					</ul>
				) }
			</div>
		) }
	</Select>
);
```

This is probably how you'd want to implement your own variations of these components most of the time.


Another case: you need to store the state globally. Let's say you're using Redux:  
The `dropdown` state becomes a leaf on your state tree and you can pass it into `<SelectDropdown>` as a prop. Instead of calling `updateDropdown` you'd be dispatching actions and all the helper functions become your reducer.

Again, there could be a specific `redux` integration that takes care of 90% of the work. Leaving you with:

```js
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
	closeDropdown,
	createDropdown,
	highlightNextDropddownItem,
	highlightPreviousDropddownItem,
	openDropdown,
	selectDropdownOption,
	toggleDropdown
} from 'headless-components/redux/dropdown/actions';

const SelectDropdown = ( {
	closeDropdown,
	createDropdown,
	dropdown,
	highlightNextDropddownItem,
	highlightPreviousDropddownItem,
	openDropdown,
	selectDropdownOption,
	toggleDropdown
} ) => {
	const ref = useRef();

	const handleOutsideClick = ( event ) => ! ref.contains( event target ) && closeDropdown( dropdown );
	const handleEscape = ( event ) => event.keyCode === keycodes.ESCAPE && closeDropdown( dropdown );

	useEffect( () => {
		document.addEventListener( 'mousedown', handleOutsideClick );
		document.addEventListener( 'keydown', handleEscape );

		return () => {
			document.removeEventListener( 'mousedown', handleOutsideClick );
			document.removeEventListener( 'keydown', handleEscape );
		};
	}, [ ref ] );

	const handleButtonKeyPress = ( event ) => event.keyCode === keycodes.ENTER && openDropdown( dropdown );

	const handleDropdownKeyPress = ( event ) => {
		event.keyCode === keycodes.DOWN && highlightNextDropdownItem( dropdown );
		event.keyCode == keycodes.UP && highlightPreviousDropdownItem( dropdown );
	};

	return (
		<div class="select-dropdown">
			<button onClick={ toggleDropdown } onKeyPress={ handleButtonKeyPress }>{ dropdown.current.label }</button>

			{ dropdown.isOpen && (
				<ul onKeyPress={ handleDropdownKeyPress }>
					{ dropdown.dropdownOptions.map( ( {
						isActive,
						option,
					} ) => (
						<li className={ { active: isActive } } onClick={ selectDropdownOption( option ) }>
							{ option.label }
						</li>
					) ) }
				</ul>
			) }
		</div>
	);
}

const ConnectedSelectDropdown = connect(
	( state, { id } ) => ( {
		dropdown: state.components[ id ],
	} ),
	( dispatch, { id } ) => ( {
		closeDropdown: () => dispatch( closeDropdown( 'state.components.' + id ) ),
		createDropdown: () => dispatch( createDropdown( 'state.components.' + id ) ),
		highlightNextDropddownItem: () => dispatch( highlightNextDropddownItem( 'state.components.' + id ) ),
		highlightPreviousDropddownItem: () => dispatch( highlightPreviousDropddownItem( 'state.components.' + id ) ),
		openDropdown: () => dispatch( openDropdown( 'state.components.' + id ) ),
		selectDropdownOption: ( option ) => () => dispatch( selectDropdownOption( 'state.components.' + id ), option ),
		toggleDropdown: () => dispatch( toggleDropdown( 'state.components.' + id ) ),
	} ),
)( SelectDropdown );
```

Now, this is not necessarily less code but it's about flexibility. If you want - or worse, if you need - you can do it.
This is meant to provide a solid implementation for complex components no matter where the JavaScript world takes us.
The core library isn't the end product, it's just a building block and it's up to the wrappers to provide better integration in existing frameworks.

---

I wonder... should these be called ui patterns rather than components.

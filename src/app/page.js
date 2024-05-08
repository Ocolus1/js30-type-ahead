"use client"

import React, { useState, useEffect } from 'react';

const TypeAhead = () => {
	const [cities, setCities] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [suggestions, setSuggestions] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const endpoint =
				'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
			const response = await fetch(endpoint);
			const data = await response.json();
			setCities(data);
		};

		fetchData();
	}, []);

	const findMatches = (wordToMatch, cities) => {
		const regex = new RegExp(wordToMatch, 'gi');
		return cities.filter(
			(place) => place.city.match(regex) || place.state.match(regex)
		);
	};

	const numberWithCommas = (x) => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	};

	const displayMatches = (e) => {
		setSearchTerm(e.target.value);
		const matchArray = findMatches(e.target.value, cities);
		const html = matchArray.map((place) => {
			const regex = new RegExp(e.target.value, 'gi');
			const cityName = place.city.replace(
				regex,
				`<span class="hl">${e.target.value}</span>`
			);
			const stateName = place.state.replace(
				regex,
				`<span class="hl">${e.target.value}</span>`
			);
			return (
				<li key={place.rank}>
					<span
						className="name"
						dangerouslySetInnerHTML={{
							__html: `${cityName}, ${stateName}`,
						}}
					></span>
					<span className="population">
						{numberWithCommas(place.population)}
					</span>
				</li>
			);
		});
		setSuggestions(html);
	};

	return (
		<div>
			<form className="search-form">
				<input
					type="text"
					className="search"
					placeholder="City or State"
					value={searchTerm}
					onChange={displayMatches}
				/>
				<ul className="suggestions">
					{suggestions.length === 0 ? (
						<li>Filter for a city</li>
					) : (
						suggestions
					)}
				</ul>
			</form>
		</div>
	);
};

export default TypeAhead;

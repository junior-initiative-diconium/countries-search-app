import "./App.scss";
import { useEffect, useState } from "react";

function App() {
	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [items, setItems] = useState([]);
	const [query, setQuery] = useState("");
	const [searchParam] = useState(["official"]);
	const [filterParam, setFilterParam] = useState(["All"]);

	useEffect(() => {
		fetch("https://restcountries.com/v3.1/all")
			.then((res) => res.json())
			.then(
				(result) => {
					setIsLoaded(true);
					setItems(result);
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) => {
					setIsLoaded(true);
					setError(error);
				}
			);
	}, []);

	const filter = (items) => {
		return items.filter((item) => {
			if (item.region == filterParam) {
				return searchParam.some((newItem) => {
					return item.name[newItem].toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
				});
			} else if (filterParam == "All") {
				return searchParam.some((newItem) => {
					return item.name[newItem].toString().toLowerCase().indexOf(query.toLowerCase()) > -1;
				});
			}
		});
	};

	if (error) {
		return <div>Error: {error.message}</div>;
	} else if (!isLoaded) {
		return <div>Loading...</div>;
	} else {
		return (
			/* here we map over the element and display each item as a card  */
			<div className='page-wrapper'>
				<h1 className='main-heading'>Around the World</h1>
				<div className='filter-wrapper'>
					<div className='search-wrapper'>
						<label htmlFor='search-form'>
							Search countries here:
							<input
								type='search'
								name='search-form'
								id='search-form'
								className='search-input'
								placeholder='Search for...'
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
						</label>
					</div>
					<div>
						<select
							/*
      // here we create a basic select input
      // we set the value to the selected value
      // and update the setFilterParam() state every time onChange is called
      */
							onChange={(e) => {
								setFilterParam(e.target.value);
							}}
							className='custom-select'
							aria-label='Filter Countries By Region'>
							<option value='All'>Filter By Region</option>
							<option value='Africa'>Africa</option>
							<option value='Americas'>America</option>
							<option value='Asia'>Asia</option>
							<option value='Europe'>Europe</option>
							<option value='Oceania'>Oceania</option>
						</select>
						<span className='focus'></span>
					</div>
				</div>
				<ul className='card-grid'>
					{filter(items).map((item) => (
						<li>
							<article className='card' key={item.name.official}>
								<div className='card-image'>
									<img src={item.flags.png} alt={item.name.official} />
								</div>
								<div className='card-content'>
									<h2 className='card-name'>{item.name.official}</h2>
									<ol className='card-list'>
										<li>
											Population: <span>{item.population}</span>
										</li>
										<li>
											Region: <span>{item.region}</span>
										</li>
										<li>
											Capital: <span>{item.capital}</span>
										</li>
									</ol>
								</div>
							</article>
						</li>
					))}
				</ul>
			</div>
		);
	}
}

export default App;


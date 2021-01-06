import React, { useState, useEffect } from 'react';
import './App.css';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@material-ui/core';
import { sortData, prettyPrintStat } from './util';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
  // #region app state
  const baseURL = 'https://disease.sh/v3/covid-19';
  const [countries, setCountries] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('worldwide');
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([20, 77]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  // #endregion

  // #region methods
  const getCountries = async () => {
    await fetch(`${baseURL}/countries`)
      .then((response) => response.json())
      .then((data) => {
        let countries = data.map((country) => ({
          name: country.country, // i.e. 'UnitedKingdom', 'India'
          value: country.countryInfo.iso2, // i.e. 'UK', 'IN'
          id: country.countryInfo._id,
        }));
        // sort by total cases
        let sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
      })
      .catch((err) => console.error(err.message));
  };

  const onSelectionChange = async (evt) => {
    let countryCode = evt.target.value;
    let uri =
      countryCode === 'worldwide'
        ? `${baseURL}/all`
        : `${baseURL}/countries/${countryCode}`;

    await fetch(uri)
      .then((response) => response.json())
      .then((data) => {
        // set data... from selected country
        setSelectedCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(7);
      })
      .catch((err) => console.error(err.message));
  };
  // #endregion

  // #region useEffect hooks
  // useEffect -> runs a piece of code based on a given condition.
  useEffect(() => {
    // The code in here execute once
    // when the component loads and not again
    getCountries();
  }, []);

  useEffect(() => {
    fetch(`${baseURL}/all`)
      .then((response) => response.json())
      .then((data) => setCountryInfo(data))
      .catch((err) => console.error(err.message));
  }, []);
  //#endregion

  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        <div className="app__header">
          {/* Logo */}
          <h2 className="app__header__logo">COVID-19 Tracker</h2>
          {/* Countries dropdown */}
          <FormControl className="app__header__dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={onSelectionChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value} key={country.id}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* statistics */}
        <div className="app__stats">
          <InfoBox
            active={casesType === 'cases'}
            onClick={(e) => setCasesType('cases')}
            title="Active Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            totalCases={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={(e) => setCasesType('recovered')}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            totalCases={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            active={casesType === 'deaths'}
            onClick={(e) => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            totalCases={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        {/* Map */}
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live cases by Country</h3>
          <Table countries={tableData} />
          {/* Chart */}
          <h3>WorldWide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

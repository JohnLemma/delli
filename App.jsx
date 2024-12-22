import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from './firebase';
import ListingCard from './components/ListingCard';
import './App.css';
import { useSwipeable } from 'react-swipeable';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
    const [properties, setProperties] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');
    const [carBrandFilter, setCarBrandFilter] = useState('all');
     const [minPrice, setMinPrice] = useState('');
     const [maxPrice, setMaxPrice] = useState('');

    const debouncedSearch = useCallback(
        (query) => {
            setSearchQuery(query);
        },
        []
    );

    const handleSearchChange = (e) => {
        const query = e.target.value;
        debouncedSearch(query);
    };

    const propertiesContainerRef = useRef(null);
    const carsContainerRef = useRef(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const propertyCollection = collection(db, 'properties');
                const propertySnapshot = await getDocs(propertyCollection);
                const rawProperties = propertySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));


                 const propertyList = rawProperties.map(data =>
                   ({
                    id: data.id,
                    title: data.title || '',
                    description: data.description || '',
                    price: data.price || 0,
                    location: data.location || '',
                    property_type: data.property_type || '',
                    features: data.features || {},
                    images: data.images || [],
                   })
                   );

                    setProperties(propertyList);


                const carCollection = collection(db, 'cars');
                const carSnapshot = await getDocs(carCollection);
                const rawCars = carSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));


                    const carList = rawCars.map(data =>
                       ({
                        id: data.id,
                        title: data.title || '',
                        description: data.description || '',
                        price: data.price || 0,
                        location: data.location || '',
                        brand: data.brand || '',
                        model: data.model || '',
                        year: data.year || 0,
                        features: data.features || {},
                        images: data.images || [],
                       })
                    );

                setCars(carList);

            } catch (err) {
                setError(err);
                console.error("Error fetching data", err)
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

   const filteredProperties = properties.filter(property => {
        const matchesSearch =
            searchQuery === '' ||
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
            propertyTypeFilter === 'all' || property.property_type === propertyTypeFilter;

     const matchesPrice =
            (minPrice === '' || property.price >= Number(minPrice)) &&
            (maxPrice === '' || property.price <= Number(maxPrice));

        return matchesSearch && matchesType && matchesPrice;

    });

    const filteredCars = cars.filter(car => {
       const matchesSearch =
            searchQuery === '' ||
            car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesBrand =
            carBrandFilter === 'all' || car.brand === carBrandFilter;

        const matchesPrice =
            (minPrice === '' || car.price >= Number(minPrice)) &&
            (maxPrice === '' || car.price <= Number(maxPrice));


        return matchesSearch && matchesBrand && matchesPrice;
    });

    const swipeHandlersProperties = useSwipeable({
      onSwipedLeft: () => {
        if (propertiesContainerRef.current) {
          propertiesContainerRef.current.scrollLeft += 300;
        }
      },
      onSwipedRight: () => {
        if (propertiesContainerRef.current) {
          propertiesContainerRef.current.scrollLeft -= 300;
        }
      },
         trackMouse: true,
         preventDefaultTouchmoveEvent: true

    });


      const swipeHandlersCars = useSwipeable({
        onSwipedLeft: () => {
           if (carsContainerRef.current) {
               carsContainerRef.current.scrollLeft += 300;
           }
        },
        onSwipedRight: () => {
             if (carsContainerRef.current) {
                 carsContainerRef.current.scrollLeft -= 300;
             }
        },
         trackMouse: true,
          preventDefaultTouchmoveEvent: true
    });


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


    return (
        <Router>
            <div className="App">
                { loading && <p className="loading-indicator">Loading...</p> }
                 <nav className="navigation">
                    <Link to="/" className="nav-button">Home</Link>
                    <Link to="/properties" className="nav-button">Properties</Link>
                    <Link to="/cars" className="nav-button">Cars</Link>
                 </nav>
                <Routes>
                    <Route path="/" element={
                        <>
                             <h1>Delala</h1>
                             <div className="filters">
                                 <input
                                    type="text"
                                    placeholder="Search Delala..."
                                     value={searchQuery}
                                     onChange={handleSearchChange}
                                     className="search-input"
                                 />
                                 <select
                                    value={propertyTypeFilter}
                                    onChange={(e) => setPropertyTypeFilter(e.target.value)}
                                    className="select-filter"
                                     >
                                    <option value="all">All Types</option>
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="land">Land</option>
                                </select>
                                 <input
                                        type="number"
                                        placeholder="Min Price"
                                        value={minPrice}
                                         onChange={(e) => setMinPrice(e.target.value)}
                                        className='search-input'
                                    />
                                    <input
                                    type="number"
                                     placeholder="Max Price"
                                    value={maxPrice}
                                     onChange={(e) => setMaxPrice(e.target.value)}
                                    className='search-input'
                                    />
                             </div>
                                <div className="listings-container-horizontal"  ref={propertiesContainerRef} {...swipeHandlersProperties}>
                                    {filteredProperties.slice(0, 1).map((property) => (
                                        <ListingCard key={property.id} listing={property} type="property" />
                                    ))}
                              </div>
                             <h1>Cars</h1>
                             <div className="filters">
                                  <input
                                  type="text"
                                    placeholder="Search cars..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                      className="search-input"
                                />
                                  <select
                                  value={carBrandFilter}
                                    onChange={(e) => setCarBrandFilter(e.target.value)}
                                    className="select-filter"
                                 >
                                    <option value="all">All Brands</option>
                                    {[...new Set(cars.map(car => car.brand))].map(brand => (
                                      <option key={brand} value={brand}>{brand}</option>
                                      ))}

                                 </select>
                                  <input
                                        type="number"
                                        placeholder="Min Price"
                                        value={minPrice}
                                         onChange={(e) => setMinPrice(e.target.value)}
                                        className='search-input'
                                        />
                                  <input
                                   type="number"
                                    placeholder="Max Price"
                                    value={maxPrice}
                                     onChange={(e) => setMaxPrice(e.target.value)}
                                   className='search-input'
                                />
                            </div>
                              <div className="listings-container-horizontal" ref={carsContainerRef} {...swipeHandlersCars}>
                                   {filteredCars.slice(0, 1).map((car) => (
                                    <ListingCard key={car.id} listing={car} type="car" />
                                  ))}
                             </div>
                        </>
                    }/>
                    <Route path="/properties" element={
                        <>
                            <h1>All Houses</h1>
                             <div className="filters">
                                  <input
                                  type="text"
                                    placeholder="Search houses..."
                                     value={searchQuery}
                                    onChange={handleSearchChange}
                                      className="search-input"
                                />
                                 <select
                                  value={propertyTypeFilter}
                                    onChange={(e) => setPropertyTypeFilter(e.target.value)}
                                    className="select-filter"
                                     >
                                    <option value="all">All Types</option>
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="land">Land</option>
                                </select>
                                  <input
                                        type="number"
                                        placeholder="Min Price"
                                        value={minPrice}
                                         onChange={(e) => setMinPrice(e.target.value)}
                                        className='search-input'
                                        />
                                   <input
                                    type="number"
                                     placeholder="Max Price"
                                    value={maxPrice}
                                     onChange={(e) => setMaxPrice(e.target.value)}
                                    className='search-input'
                                />
                            </div>
                            <div className="listings-container">
                                 {filteredProperties.map((property) => (
                                    <ListingCard key={property.id} listing={property} type="property" />
                                 ))}
                            </div>
                        </>
                    }/>
                    <Route path="/cars" element={
                        <>
                           <h1>All Cars</h1>
                                 <div className="filters">
                                  <input
                                  type="text"
                                    placeholder="Search cars..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                      className="search-input"
                                />
                                <select
                                  value={carBrandFilter}
                                    onChange={(e) => setCarBrandFilter(e.target.value)}
                                    className="select-filter"
                                 >
                                    <option value="all">All Brands</option>
                                    {[...new Set(cars.map(car => car.brand))].map(brand => (
                                      <option key={brand} value={brand}>{brand}</option>
                                      ))}

                                 </select>
                                    <input
                                        type="number"
                                        placeholder="Min Price"
                                        value={minPrice}
                                         onChange={(e) => setMinPrice(e.target.value)}
                                        className='search-input'
                                        />
                                <input
                                   type="number"
                                    placeholder="Max Price"
                                    value={maxPrice}
                                     onChange={(e) => setMaxPrice(e.target.value)}
                                     className='search-input'
                                />
                            </div>
                            <div className="listings-container">
                                {filteredCars.map((car) => (
                                    <ListingCard key={car.id} listing={car} type="car" />
                                ))}
                             </div>
                       </>
                    }/>
                 </Routes>
            </div>
        </Router>
    );
}

export default App;
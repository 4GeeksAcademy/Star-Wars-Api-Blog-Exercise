
const getState = ({ getStore, getActions, setStore }) => {

    return {

        store: {
            people: [],

            planets: [],

            starships: [],

            favorites: [],

            counter: 0,

            auth: false, 

        },


        actions: {

            validToken: async () => {
                try {
                    let response = await fetch('https://psychic-space-orbit-x55wrxwpjpr7crvg-3000.app.github.dev/valid_token', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMjI1NzEyNywianRpIjoiNGJhYjhiZjAtZDFmMC00ZmE0LTlkYzItYWExZjcwMDNiNmI3IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImJhcmJhcmFwdXlvbGZvbnRAZ21haWwuY29tIiwibmJmIjoxNzEyMjU3MTI3LCJjc3JmIjoiNmI4NzNlNjEtNjRlOC00MmZkLThhY2EtOGI0ZDk1N2MwZWVlIiwiZXhwIjoxNzEyMjU4MDI3fQ.VxxlrDrBkCpf17TXKjE9CwYJzdre3VVM6bA3mcVblWY',
                        },
                });
                    let data = await response.json();
                    if (response.status === 200) {
                        setStore({auth: data.is_})
                    }
                    console.log(data);
                } catch (error) {
                    console.error(error);
                }
            },
            

            addFavorites: (name) => {
                setStore({
                    favorites: [...getStore().favorites, name],
                    counter: getStore().counter + 1,
                });
            },


        
            deleteFavorites: (name) => {
                const currentFavorites = getStore().favorites;
                const updatedFavorites = currentFavorites.filter((favorite) => favorite !== name);
                
                setStore({
                    favorites: updatedFavorites,
                    counter: updatedFavorites.length,
                });
            },
            




            getPeople: async () => {
                try {
                    const storedDataPeople = localStorage.getItem("peopleData");

                    if (storedDataPeople) {
                        setStore({ people: JSON.parse(storedDataPeople) });
                    } else {
                        const fetchPromises = [];
                        for (let index = 1; index <= 10; index++) {
                            const urlPeople = `https://www.swapi.tech/api/people/${index}`;
                            const fetchPromise = fetch(urlPeople)
                                .then(res => res.json())
                                .catch(err => console.error(`Error to get data from ${urlPeople}: ${err}`));

                            fetchPromises.push(fetchPromise);
                        }

                        const people = await Promise.all(fetchPromises);

                        setStore({ people });

                        localStorage.setItem("peopleData", JSON.stringify(people));
                    }
                } catch (error) {
                    console.error('Error to get people details:', error);
                }
            },




            getPlanets: async () => {
                try {
                    const storedDataPlanets = localStorage.getItem("planetsData");

                    if (storedDataPlanets) {
                        setStore({ planets: JSON.parse(storedDataPlanets) });
                    } else {
                        const fetchPromisesPlanets = [];
                        for (let index = 1; index <= 10; index++) {
                            const urlPlanets = `https://www.swapi.tech/api/planets/${index}`;
                            const fetchPromisePlanet = fetch(urlPlanets)
                                .then(res => res.json())
                                .catch(err => console.error(`Error getting data from  ${urlPlanets}: ${err}`));

                            fetchPromisesPlanets.push(fetchPromisePlanet);
                        }

                        const planets = await Promise.all(fetchPromisesPlanets);

                        setStore({ planets });

                        localStorage.setItem("planetsData", JSON.stringify(planets));
                    }
                } catch (error) {
                    console.error('Error getting planets details:', error);
                }
            },




            getStarships: async () => {
                try {
                    const storedDataStarships = localStorage.getItem("starshipsData");

                    if (storedDataStarships) {
                        setStore({ starships: JSON.parse(storedDataStarships) });

                    } else {
                        const fetchPromisesStarships = [];
                        const maxStarships = 10;
                        let starshipsDetailsWithPropertiesCount = 0;
                        let totalStarshipsDetailsChecked = 0;

                        const fetchStarshipDetailsData = async (index) => {
                            const url = `https://www.swapi.tech/api/starships/${index}`;
                            try {
                                const res = await fetch(url);
                                const data = await res.json();

                                if (data && data.result && data.result.properties) {
                                    starshipsDetailsWithPropertiesCount++;
                                    return data;
                                } else {
                                    throw new Error('Starship without properties');
                                }
                            } catch (error) {
                                console.error(`Error getting data from ${url}: ${error}`);
                                return null;
                            }
                        };

                        
                        while (starshipsDetailsWithPropertiesCount < maxStarships && totalStarshipsDetailsChecked < maxStarships * 2) {
                            const starshipDetailsData = await fetchStarshipDetailsData(totalStarshipsDetailsChecked + 1);
                            if (starshipDetailsData) {
                                fetchPromisesStarships.push(starshipDetailsData);
                            }
                            totalStarshipsDetailsChecked++;
                        }

                        const starships = await Promise.all(fetchPromisesStarships);

                        setStore({ starships });

                        localStorage.setItem("starshipsData", JSON.stringify(starships));
                    }
                } catch (error) {
                    console.error('Error getting starships details:', error);
                }
            },
            login: async (email, password) => {
                try {
                    const response = await fetch('https://psychic-space-orbit-x55wrxwpjpr7crvg-3000.app.github.dev/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    });
            
                    if (response.status !== 200) {
                        console.log('Login failed:', response.statusText);
                        return false;
                    }
            
                    const data = await response.json();
                    console.log('Login successful:', data);
                    localStorage.setItem ('token', data.access_token);
                    return true;
                } catch (error) {
                    console.error('Error during login:', error);
                    return false;
                }
            },

        }
    };
}
export default getState;

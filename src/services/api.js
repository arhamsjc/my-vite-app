import axios from 'axios';

const API_BASE_URL = 'https://punkapi.online/v3';

export const fetchBeers = async ({
  page = 1,
  perPage = 30,
  beerName,
  brewedBefore,
  brewedAfter,
  abvGt,
  abvLt,
  ibuGt,
  ibuLt,
  ebcGt,
  ebcLt,
  food,
  ids,
}) => {
  try {
    const params = new URLSearchParams({
      page,
      per_page: perPage,
      ...(beerName && { beer_name: beerName }),
      ...(brewedBefore && { brewed_before: brewedBefore }),
      ...(brewedAfter && { brewed_after: brewedAfter }),
      ...(abvGt && { abv_gt: abvGt }),
      ...(abvLt && { abv_lt: abvLt }),
      ...(ibuGt && { ibu_gt: ibuGt }),
      ...(ibuLt && { ibu_lt: ibuLt }),
      ...(ebcGt && { ebc_gt: ebcGt }),
      ...(ebcLt && { ebc_lt: ebcLt }),
      ...(food && { food }),
      ...(ids?.length > 0 && { ids: ids.join(',') }),
    });

    const response = await axios.get(`${API_BASE_URL}/beers?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching beers:', error);
    throw error;
  }
};

export const fetchRandomBeer = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/beers/random`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching random beer:', error);
    throw error;
  }
};

export const fetchBeerById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/beers/${id}`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching beer:', error);
    throw error;
  }
};
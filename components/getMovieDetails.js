const getMovieDetails = async (movieTitle) => {
  try {
    const apiKey = "95bd2e13";
    const response = await fetch(
      `http://www.omdbapi.com/?t=${movieTitle}&plot="full"&apikey=${apiKey}`
    );
    const data = await response.json();

    if (response.ok && data.Genre) {
      data.Genre = data.Genre.split(",").map((genre) => genre.trim());
      return data;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export default getMovieDetails;

const searchByTitle = async (movieTitle) => {
  try {
    const apiKey = "95bd2e13";
    const response = await fetch(
      `http://www.omdbapi.com/?s=${movieTitle}&plot="full"&apikey=${apiKey}`
    );
    const data = await response.json();
    if (data.Response === "True") {
      return data.Search.slice(0, 10);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export default searchByTitle;

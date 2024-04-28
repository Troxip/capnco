export async function fetchData() {
  const limit = 25;
  const offsets = Array.from({ length: 600 }, (_, index) => index * limit); // Generate offsets from 0 to 2000
  let combinedData = [];

  try {
    const responses = await Promise.all(
      offsets.map(async (offset) => {
        const res = await fetch(
          `https://odyn-backend.fly.dev/games/capncouserprofiles/?limit=${limit}&offset=${offset}&ordering=-mblast_balance`
        );
        return res.json();
      })
    );

    // Combine data from all responses
    combinedData = responses.reduce((acc, cur) => {
      return acc.concat(cur.results);
    }, []);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return combinedData;
}

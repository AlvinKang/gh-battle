import axios from "axios";
import credentials from "../../credentials";

// For rate limits
const CLIENT_ID = credentials.CLIENT_ID;
const CLIENT_SECRET = credentials.CLIENT_SECRET;
const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

async function getProfile(username) {
  const profile = await axios.get(
    `https://api.github.com/users/${username}${params}`
  );

  return profile.data;
}

function getRepos(username) {
  return axios.get(`https://api.github.com/users/${username}/repos${params}`);
}

function getStarCount(repos) {
  return repos.data.reduce(
    (count, { stargazers_count }) => count + stargazers_count,
    0
  );
}

function calculateScore({ followers }, repos) {
  return followers * 3 + getStarCount(repos);
}

function handleError(error) {
  console.warn(error);
  return null;
}

async function getUserData(player) {
  const [profile, repos] = await Promise.all([
    getProfile(player),
    getRepos(player)
  ]);

  return {
    profile,
    score: calculateScore(profile, repos)
  };
}

// Returns brand new array, sortPlayers()[0] is the player with higher score
function sortPlayers(players) {
  return players.sort((a, b) => b.score - a.score);
}

export async function battle(players) {
  const results = await Promise.all(players.map(getUserData)).catch(
    handleError
  );

  return results === null ? results : sortPlayers(results);
}

export async function fetchPopularRepos(language) {
  const encodedURI = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  );

  const repos = await axios.get(encodedURI).catch(handleError);
  return repos.data.items;
}

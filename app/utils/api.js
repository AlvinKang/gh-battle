import axios from "axios";
import credentials from "../../credentials";

// For rate limits
const CLIENT_ID = credentials.CLIENT_ID;
const CLIENT_SECRET = credentials.CLIENT_SECRET;
const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

function getProfile(username) {
  return axios
    .get(`https://api.github.com/users/${username}${params}`)
    .then(({ data }) => data);
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

function getUserData(player) {
  return Promise.all([getProfile(player), getRepos(player)]).then(
    ([profile, repos]) => ({
      profile,
      score: calculateScore(profile, repos)
    })
  );
}

// Returns brand new array, sortPlayers()[0] is the player with higher score
function sortPlayers(players) {
  return players.sort((a, b) => b.score - a.score);
}

export function battle(players) {
  return Promise.all(players.map(getUserData))
    .then(sortPlayers)
    .catch(handleError);
}

export function fetchPopularRepos(language) {
  const encodedURI = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  );
  return axios.get(encodedURI).then(({ data }) => data.items);
}

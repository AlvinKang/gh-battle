const axios = require("axios");
const credentials = require("../../credentials");

// For rate limits
const CLIENT_ID = credentials.CLIENT_ID;
const CLIENT_SECRET = credentials.CLIENT_SECRET;
const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

function getProfile(username) {
  return axios
    .get(`https://api.github.com/users/${username}${params}`)
    .then(user => user.data);
}

function getRepos(username) {
  return axios.get(`https://api.github.com/users/${username}/repos${params}`);
}

function getStarCount(repos) {
  return repos.data.reduce((count, repo) => {
    return count + repo.stargazers_count;
  }, 0);
}

function calculateScore(profile, repos) {
  const followers = profile.followers;
  const totalStars = getStarCount(repos);

  return followers * 3 + totalStars;
}

function handleError(error) {
  console.warn(error);
  return null;
}

function getUserData(player) {
  return axios.all([getProfile(player), getRepos(player)]).then(data => {
    const profile = data[0];
    const repos = data[1];

    return {
      profile: profile,
      score: calculateScore(profile, repos)
    };
  });
}

// Returns brand new array, sortPlayers()[0] is the player with higher score
function sortPlayers(players) {
  return players.sort((a, b) => b.score - a.score);
}

module.exports = {
  battle: function(players) {
    return axios
      .all(players.map(getUserData))
      .then(sortPlayers)
      .catch(handleError);
  },
  fetchPopularRepos: function(language) {
    const encodedURI = window.encodeURI(
      `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
    );
    return axios.get(encodedURI).then(res => res.data.items);
  }
};

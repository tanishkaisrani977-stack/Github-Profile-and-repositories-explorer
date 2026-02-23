// ================================
// Select input field for GitHub username
// ================================
const usernameInput = document.getElementById("usernameInput");

// Select search button
const searchBtn = document.getElementById("searchBtn");

// Select loading text and error text elements
const loadingText = document.getElementById("loading");
const errorText = document.getElementById("error");


// ================================
// Handle search button click
// ================================
searchBtn.addEventListener("click", () => {
  // Get and trim username input
  const username = usernameInput.value.trim();

  // Validation: empty input
  if (username === "") {
    errorText.textContent = "Please enter a username";
    return;
  }

  // Clear previous error and fetch user
  errorText.textContent = "";
  fetchGitHubUser(username);
});


// ================================
// Show loading indicator & disable button
// ================================
function showLoading() {
  loadingText.classList.remove("hidden");
  searchBtn.disabled = true;
}


// ================================
// Hide loading indicator & enable button
// ================================
function hideLoading() {
  loadingText.classList.add("hidden");
  searchBtn.disabled = false;
}


// ================================
// Fetch GitHub user data
// ================================
async function fetchGitHubUser(username) {
  showLoading();

  try {
    // Fetch user profile data from GitHub API
    const response = await fetch(`https://api.github.com/users/${username}`);

    // Handle user not found
    if (!response.ok) {
      throw new Error("User not found");
    }

    // Convert response to JSON
    const userData = await response.json();

    // Display profile info
    displayUserProfile(userData);

    // Fetch repositories of user
    fetchRepositories(username);

  } catch (error) {
    // Show error message
    errorText.textContent = error.message;
  } finally {
    // Always hide loading
    hideLoading();
  }
}


// ================================
// Display user profile on UI
// ================================
const profileDiv = document.getElementById("profile");

function displayUserProfile(user) {
  profileDiv.innerHTML = `
    <div class="profile-card">
      <img src="${user.avatar_url}" alt="Avatar" class="avatar">

      <div class="profile-info">
        <h2>${user.name ? user.name : user.login}</h2>
        <p>${user.bio ? user.bio : "No bio available"}</p>

        <div class="stats">
          <span>👥 Followers: ${user.followers}</span>
          <span>➡️ Following: ${user.following}</span>
          <span>📦 Repos: ${user.public_repos}</span>
        </div>
      </div>
    </div>
  `;
}


// ================================
// Fetch repositories of the user
// ================================
const reposDiv = document.getElementById("repos");

async function fetchRepositories(username) {
  try {
    // Fetch repositories from GitHub API
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );

    // Handle fetch error
    if (!response.ok) {
      throw new Error("Could not fetch repositories");
    }

    // Convert response to JSON
    const repos = await response.json();

    // Display repositories
    displayRepositories(repos);

  } catch (error) {
    reposDiv.innerHTML = `<p>${error.message}</p>`;
  }
}


// ================================
// Display repositories on UI
// ================================
function displayRepositories(repos) {
  reposDiv.innerHTML = "";

  // If no repositories exist
  if (repos.length === 0) {
    reposDiv.innerHTML = "<p>No repositories found.</p>";
    return;
  }

  // ⭐ Sort repositories by stars (descending order)
  repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

  // Loop through repositories and create cards
  repos.forEach((repo) => {
    const repoCard = document.createElement("div");
    repoCard.classList.add("repo-card");

    repoCard.innerHTML = `
<div id="repos" class="repo-container"></div>
      <h3>${repo.name}</h3>
      <p>⭐ Stars: ${repo.stargazers_count}</p>
      <p>🍴 Forks: ${repo.forks_count}</p>
      <p>📝 Language: ${repo.language || "Not specified"}</p>
      <a href="${repo.html_url}" target="_blank">View Repository</a>
    `;

    reposDiv.appendChild(repoCard);
  });
}
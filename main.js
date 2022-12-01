const APIURL = 'https://api.github.com/users/'

const main = document.getElementById("main")
const form = document.getElementById("form")
const search = document.getElementById("search")

// Pulling username data from API
async function getUser(userName) {
  try {
    const { data } = await axios(APIURL + userName)
    createUserCard(data)
    getRepo(userName)
  } catch (error) {
    if ( error.response.status == 404 ) {
      createErrorCard("No exist profile with this username.")
    }
  }
}

// Pulling repositories if any exist
async function getRepo(userName) {
  try {
    const { data } = await axios(APIURL + userName + "/repos?sort=created")
    addRepoToCard(data)
  } catch (error) {
      createErrorCard("Problem fetching repositories")
  }
}

// Creating User Card
function createUserCard(user) {
  const userID = user.name || user.login
  const userBio = user.bio ? `<p>${user.bio}</p>` : ''
  const cardHTML = `
    <div class="card">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}
      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
      </ul>
      <div id="repositories"></div>
    </div>
  </div>
    `
  main.innerHTML = cardHTML
}

// Adding repositories to card
function addRepoToCard(repo) {
  const repositories = document.getElementById("repositories")

  repo
      .slice(0, 5)
      .forEach(repo => {
        const tempRepo = document.createElement("a")
        tempRepo.classList.add("repo")
        tempRepo.href = repo.html_url
        tempRepo.target = "_blank"
        tempRepo.innerText = repo.name

        repositories.appendChild(tempRepo)
      });
}

// Creating Error Card
function createErrorCard(errMsg) {
  const cardHTML = `
    <div class="card">
      <h1>${errMsg}</h1>
    </div>
  `

  main.innerHTML = cardHTML
}

form.addEventListener("submit", (event) => {
  event.preventDefault()

  const user = search.value

  if ( user ) {
    getUser(user)
    search.value = ''
  }
})
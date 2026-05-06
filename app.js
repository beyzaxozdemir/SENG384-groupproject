let posts = [];

function login() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
}

function logout() {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("auth").style.display = "block";
}

async function loadPosts() {
  const res = await fetch("http://localhost:3000/posts");
  posts = await res.json();
  renderPosts();
}

async function addPost() {
  let title = document.getElementById("title").value;
  let domain = document.getElementById("domain").value;
  let city = document.getElementById("city").value;

  if (!title || !domain || !city) {
    alert("Please fill all fields!");
    return;
  }

  let newPost = { title, domain, city };

  await fetch("http://localhost:3000/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost)
  });

  loadPosts();

  document.getElementById("title").value = "";
  document.getElementById("domain").value = "";
  document.getElementById("city").value = "";
}

function renderPosts() {
  let list = document.getElementById("postList");
  list.innerHTML = "";

  posts.forEach((p, index) => {
    let statusClass = p.status === "Draft" ? "status-draft" : "status-active";

    let div = document.createElement("div");
    div.className = "card post";

    div.innerHTML = `
      <h3>${p.title}</h3>
      <p><b>Domain:</b> ${p.domain}</p>
      <p><b>City:</b> ${p.city}</p>
      <p class="${statusClass}">Status: ${p.status}</p>
      <div class="actions">
        ${
          p.status === "Draft"
            ? `<button onclick="publish(${index})">Publish</button>`
            : `<button disabled>Published</button>`
        }
        <button onclick="deletePost(${index})">Delete</button>
      </div>
    `;

    list.appendChild(div);
  });
}

async function publish(i) {
  await fetch(`http://localhost:3000/posts/${i}`, {
    method: "PATCH"
  });
  loadPosts();
}

async function deletePost(i) {
  if (confirm("Are you sure?")) {
    await fetch(`http://localhost:3000/posts/${i}`, {
      method: "DELETE"
    });
    loadPosts();
  }
}

function filterPosts() {
  let value = document.getElementById("search").value.toLowerCase();

  if (value === "") {
    renderPosts();
    return;
  }

  let list = document.getElementById("postList");
  list.innerHTML = "";

  posts
    .filter(p => p.city.toLowerCase().includes(value))
    .forEach((p) => {
      let div = document.createElement("div");
      div.className = "card post";

      let statusClass = p.status === "Draft" ? "status-draft" : "status-active";

      div.innerHTML = `
        <h3>${p.title}</h3>
        <p><b>Domain:</b> ${p.domain}</p>
        <p><b>City:</b> ${p.city}</p>
        <p class="${statusClass}">Status: ${p.status}</p>
      `;

      list.appendChild(div);
    });
}

window.onload = loadPosts;
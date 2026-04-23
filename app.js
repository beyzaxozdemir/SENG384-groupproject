let posts = JSON.parse(localStorage.getItem("posts")) || [];

function login() {
  let email = document.getElementById("email").value.trim();
  let role = document.getElementById("role").value;

  let basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!basicEmail.test(email)) {
    showError("Invalid email format!");
    return;
  }

  if (!email.includes(".edu")) {
    showError("Only university emails allowed!");
    return;
  }

  localStorage.setItem("role", role);

  document.getElementById("auth").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  document.getElementById("navTitle").innerText =
    "Health AI Platform - " + role;
}

function logout() {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("auth").style.display = "block";
}

function showError(msg) {
  let error = document.getElementById("errorMsg");
  error.innerText = msg;
  error.style.display = "block";
}

function addPost() {
  let role = localStorage.getItem("role");
  if (role !== "Engineer") {
    alert("Only engineers can create posts!");
    return;
  }

  let title = document.getElementById("title").value;
  let domain = document.getElementById("domain").value;
  let city = document.getElementById("city").value;

  if (!title || !domain || !city) {
    alert("Please fill all fields!");
    return;
  }

  let newPost = {
    title,
    domain,
    city,
    status: "Draft"
  };

  posts.push(newPost);
  renderPosts();

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
            ? `<button class="btn-primary" onclick="publish(${index})">Publish</button>`
            : `<button class="btn-secondary" disabled>Published</button>`
        }
        <button class="btn-danger" onclick="deletePost(${index})">Delete</button>
      </div>
    `;

    list.appendChild(div);
  });

  localStorage.setItem("posts", JSON.stringify(posts));
}

function publish(i) {
  posts[i].status = "Active";
  renderPosts();
}

function deletePost(i) {
  if (confirm("Are you sure you want to delete this post?")) {
    posts.splice(i, 1);
    renderPosts();
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

window.onload = function () {
  renderPosts();
};
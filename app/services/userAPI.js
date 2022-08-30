function apiGetUser() {
   return axios({
      url: `https://62f50939535c0c50e76847d8.mockapi.io/users`,
      method: "GET",
   });
}

function apiAddUser(user) {
   return axios({
      url: `https://62f50939535c0c50e76847d8.mockapi.io/users`,
      method: "POST",
      data: user,
   });
}

function apiDeleteUser(id) {
   return axios({
      url: `https://62f50939535c0c50e76847d8.mockapi.io/users/${id}`,
      method: "DELETE",
   });
}

function apitGetProductById(id) {
   return axios({
      url: `https://62f50939535c0c50e76847d8.mockapi.io/users/${id}`,
      method: "GET",
   });
}

function apiUpdateUser(user, id) {
   return axios({
      url: `https://62f50939535c0c50e76847d8.mockapi.io/users/${id}`,
      method: "PUT",
      data: user,
   });
}

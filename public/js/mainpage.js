axios.get("/api/getAllRoutes").then(response => {
  var resp = response.data;
  for (let i = 0; i < resp.length; i++) {
    console.log(resp[i].$.title);
  }
});

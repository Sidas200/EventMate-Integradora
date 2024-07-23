/*window.addEventListener("load", async () => {
    await fetch("http://localhost:3000/check-session")
      .then((res) => res.json())
      .then((results) => {
        console.log(results);
        if (!results.loggedIn) {
         //window.location.href = "login.html";
        } else {
        console.log(results);
        document.getElementById("welcome_message").innerText = 'Bienvenido, {$results.username}';
        }
      });
  });*/
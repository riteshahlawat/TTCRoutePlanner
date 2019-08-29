axios.get("http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc")
    .then(response => {
        console.log(response.data);
    })
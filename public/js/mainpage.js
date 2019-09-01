var allowLoad = true;
class Cards extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    amountToLoad: 10,
    routeList: [],
    routeConfig: []
  };
  componentDidMount() {
    this.updateRoutes();
    window.addEventListener("scroll", this.listenToScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenToScroll);
  }
  componentDidUpdate() {}
  // Used to fetch the data to update the component states
  updateRoutes = () => {
    allowLoad = false;
    document.querySelectorAll(".loader")[0].style.visibility = "visible";
    // Route List state updater
    axios.get("/api/getAllRoutes/" + this.state.amountToLoad).then(response => {
      this.setState({ routeList: response.data });

      // Iterate through the routeList and get it's actual directional name
      for (let i = 0; i < this.state.routeList.length; i++) {
        // Tag of each bus route
        var element = this.state.routeList[i].$.tag;
        axios
          .get("/api/getRouteConfiguration/" + element + "?stopsOnly=false")
          .then(configResponse => {
            let busTag = "" + this.state.routeList[i].$.tag;
            let busRouteConfiguration = {};
            // This temporary object contains a bus tag's individual bus directions
            busRouteConfiguration[busTag] = configResponse.data;
            // Push it to the routeconfig
            this.setState({
              routeConfig: [...this.state.routeConfig, busRouteConfiguration]
            });
          });
      }

      document.querySelectorAll(".loader")[0].style.visibility = "hidden";
      // Allow to fetch more data once data has loaded
      allowLoad = true;
    });
  };
  // Ran once user scrolls
  listenToScroll = () => {
    // Determines height of card for infinite scrolling
    var cardHeight =
      parseInt(getComputedStyle(document.querySelector(".card")).height, 10) +
      parseInt(getComputedStyle(document.querySelector(".card")).marginTop, 10);
    var loaderHeight =
      parseInt(getComputedStyle(document.querySelector(".loader")).height, 10) +
      parseInt(
        getComputedStyle(document.querySelector(".loader")).marginTop,
        10
      );
    var changedHeight =
      document.querySelectorAll(".card").length * cardHeight - window.scrollY;
    // If at bottom with allowLoad to debounce
    if (changedHeight < innerHeight + loaderHeight && allowLoad) {
      this.loadData();
    }
  };
  busTitleToDirectionName = busTag => {
    var busNames = [];
    for (let i = 0; i < this.state.routeConfig.length; i++) {
      // If bus tag is equal to the key which contains the routes for each busTag
      if (Object.keys(this.state.routeConfig[i]) == busTag) {
        // Iterate through each direction
        for (let ii = 0; ii < this.state.routeConfig[i][busTag].length; ii++) {
          // Actual title that is going to be used for the cards
          busNames.push(this.state.routeConfig[i][busTag][ii].$.title);
        }
      }
    }
    return busNames;
  };
  // Function to load data **AFTER IT HAS BEEN LOADED**, i.e. Infinite scrolling
  loadData = () => {
    this.setState((state, props) => {
      // Increase data to load by 5
      // Loads 5 more buses each time but not necessarily 5 more cards
      // As the cards are the individual route configurations of a bus
      state.amountToLoad += 5;
    });
    // call after setting the state above as it takes the current amount to load
    // into consideration
    this.updateRoutes();
  };
  render() {
    return (
      <div class="mediator-container">
        {this.state.routeList.map((route, index) =>
            this.busTitleToDirectionName(this.state.routeList[index].$.tag).map(busDir => {
              return <Card busName={busDir} />
            })
        )}
        
        <span class="loader">
          <span class="loader-inner"></span>
        </span>
      </div>
      
    );
  }
}
class Card extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // Logging to see if render method is called
    console.log("Ran");
    return (
      <div className="card">
        <div className="card-header">
          <div className="bus-name">
            <p>{this.props.busName}</p>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Cards
    ref={cardsComponent => {
      window.cardsComponent = cardsComponent;
    }}
  />,
  document.getElementById("container")
);

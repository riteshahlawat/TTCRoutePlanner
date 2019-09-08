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
      this.state.routeList.map((route,index) => {
        // convert to array to iterate through
        var value = Object.values(route)[0];
        value.map((config, configIndex) => {
          // update route config list
          // TODO: Increase performance by not going through the indexes
          // Which have already been done
          this.setState({ routeConfig: [...this.state.routeConfig, config.$] });
          console.log(this.state.routeConfig);
        });
      });
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
        {this.state.routeConfig.map((route, index) =>
            <Card busName={route.title} />
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

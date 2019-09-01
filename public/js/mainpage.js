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
      for(let i = 0; i < this.state.routeList.length; i++) {
        // Tag of each bus route
        var element = this.state.routeList[i].$.tag;
        axios.get("/api/getRouteConfiguration/" + element + "?stopsOnly=false").then(configResponse => {
          let busTag = "" + this.state.routeList[i].$.tag;
          let busRouteConfiguration = {};
          // This temporary object contains a bus tag's individual bus directions
          busRouteConfiguration[busTag] = configResponse.data;
          // Push it to the routeconfig
          this.setState({routeConfig: [...this.state.routeConfig, busRouteConfiguration]});
          console.log(this.state.routeConfig);
        });
      }
      

      document.querySelectorAll(".loader")[0].style.visibility = "hidden";
      // Allow to fetch more data once data has loaded
      allowLoad = true;
    });
  };

  listenToScroll = () => {
    var cardHeight =
      parseInt(getComputedStyle(document.querySelector(".card")).height, 10) +
      parseInt(getComputedStyle(document.querySelector(".card")).marginTop, 10);
    var loaderHeight = parseInt(
      getComputedStyle(document.querySelector(".loader")).height, 10) + 
      parseInt(getComputedStyle(document.querySelector(".loader")).marginTop, 10);
    var changedHeight =
      this.state.routeList.length * cardHeight - window.scrollY;
    // If at bottom with allowLoad to debounce
    if (changedHeight < innerHeight + loaderHeight && allowLoad) {
      this.loadData();
    }
  };
  loadData = () => {
    this.setState((state, props) => {
      state.amountToLoad+=5;
    });
    this.updateRoutes();
  };
  render() {
    return (
      <div class="mediator-container">
        {this.state.routeList.map((route, index) => 
          <Card busName={this.state.routeList[index].$.title} />
          // {
          //   this.state
          // }
        )}
        <span class="loader"><span class="loader-inner"></span></span>
      </div>
    );
  }
}
class Card extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
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

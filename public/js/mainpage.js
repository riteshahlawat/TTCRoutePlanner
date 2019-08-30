var allowLoad = true;

class Cards extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    amountToLoad: 10,
    routeList: []
  };
  componentDidMount() {
    this.updateRoutes();
    window.addEventListener("scroll", this.listenToScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenToScroll);
  }
  componentDidUpdate() {}
  updateRoutes = () => {
    allowLoad = false;
    document.querySelectorAll(".loader")[0].style.visibility = "visible";
    axios.get("/api/getAllRoutes/" + this.state.amountToLoad).then(response => {
      this.setState({ routeList: response.data });
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
    this.setState({ amountToLoad: this.state.amountToLoad + 5 });
    this.updateRoutes();
  };
  render() {
    return (
      <div class="mediator-container">
        {this.state.routeList.map((route, index) => (
          <Card busName={this.state.routeList[index].$.title} />
        ))}
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

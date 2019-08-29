class Cards extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    appending: false,
    amountToLoad: 10,
    routeList: []
  };
  componentDidMount() {
    this.updateRoutes();
    this.infiscroll();
  }
  componentDidUpdate() {}
  updateRoutes = () => {
    this.setState({ appending: true });
    axios.get("/api/getAllRoutes/" + this.state.amountToLoad).then(response => {
      this.setState({ routeList: response.data });
      this.setState({ appending: false });
    });
  };
  infiscroll = () => {
    document.getElementById("test-button").addEventListener("click", e => {
      this.setState({ amountToLoad: this.state.amountToLoad + 5 });
      this.updateRoutes();
    });
  };
  render() {
    if (this.state.appending == true) {
      return <h1 className="centered">Loading..</h1>;
    } else {
      return this.state.routeList.map((route, index) => (
        <Card busName={this.state.routeList[index].$.title} />
      ));
    }
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

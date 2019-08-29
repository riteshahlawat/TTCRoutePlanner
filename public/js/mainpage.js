
var loaded = false;

class Cards extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    routeList : []
  };
  componentDidMount() {
    axios.get("/api/getAllRoutes").then(response => {
        this.setState({routeList : response.data});
        // var resp = response.data;
        // for (let i = 0; i < resp.length; i++) {
        //   console.log(resp[i].$.title);
        // }
      });
  }
  componentDidUpdate() {
    loaded = true;
    console.log(this.state.routeList);
  }
  render() {
      if(this.state.routeList.length==0) {
        return (<h1 className="centered">Loading..</h1>);
      }
      else {
        return this.state.routeList.map((route, index) => (
           <Card 
           busName={this.state.routeList[index].$.title}
           /> 
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

ReactDOM.render(<Cards />, document.getElementById("container"));

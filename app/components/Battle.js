const React = require("react");
const PropTypes = require("prop-types");
const Link = require("react-router-dom").Link;

function PlayerPreview(props) {
  return (
    <div>
      <div className="column">
        <img
          className="avatar"
          src={props.avatar}
          alt={`Avatar for ${props.username}`}
        />
        <h2 className="username">@{props.username}</h2>
      </div>
      <button className="reset" onClick={props.onReset.bind(null, props.id)}>
        Reset
      </button>
    </div>
  );
}

PlayerPreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

class PlayerInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const username = event.target.value;
    this.setState({
      username: username
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.props.id, this.state.username);
  }

  render() {
    return (
      <form className="column" onSubmit={this.handleSubmit}>
        <label className="header" htmlFor="username">
          {this.props.label}
        </label>
        <input
          id="username"
          placeholder="github username"
          type="text"
          autoComplete="off"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <button
          className="button"
          type="submit"
          disabled={!this.state.username}
        >
          Submit
        </button>
      </form>
    );
  }
}

PlayerInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerOneName: "",
      playerTwoName: "",
      playerOneImage: null,
      playerTwoImage: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit(id, username) {
    const newState = {};

    // id is either playerOne or playerTwo
    newState[`${id}Name`] = username;
    newState[`${id}Image`] = `https://github.com/${username}.png?size=200`;
    this.setState(newState);
  }

  handleReset(id) {
    const newState = {};

    newState[`${id}Name`] = "";
    newState[`${id}Image`] = null;
    this.setState(newState);
  }

  render() {
    const match = this.props.match;

    const playerOneName = this.state.playerOneName;
    const playerTwoName = this.state.playerTwoName;
    const playerOneImage = this.state.playerOneImage;
    const playerTwoImage = this.state.playerTwoImage;

    return (
      <div>
        <div className="row">
          {!playerOneName && (
            <PlayerInput
              id="playerOne"
              label="Player One"
              onSubmit={this.handleSubmit}
            />
          )}
          {playerOneImage !== null && (
            <PlayerPreview
              avatar={playerOneImage}
              username={playerOneName}
              onReset={this.handleReset}
              id="playerOne"
            />
          )}
          {!playerTwoName && (
            <PlayerInput
              id="playerTwo"
              label="Player Two"
              onSubmit={this.handleSubmit}
            />
          )}
          {playerTwoImage !== null && (
            <PlayerPreview
              avatar={playerTwoImage}
              username={playerTwoName}
              onReset={this.handleReset}
              id="playerTwo"
            />
          )}
        </div>
        {playerOneImage &&
          playerTwoImage && (
            <Link
              className="button"
              to={{
                pathname: match.url + "/results",
                search: `?playerOneName=${playerOneName}&playerTwoName=${playerTwoName}`
              }}
            >
              Battle
            </Link>
          )}
      </div>
    );
  }
}

module.exports = Battle;

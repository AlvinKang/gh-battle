var React = require("react");

class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: "All"
    };
  }

  updateLanguage(language) {
    this.setState({
      selectedLanguage: language
    });
  }

  render() {
    const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];
    const langElements = languages.map(language => {
      return (
        <li
          style={
            language === this.state.selectedLanguage
              ? { color: "#e01a1a" }
              : null
          }
          key={language}
          onClick={this.updateLanguage.bind(this, language)}
        >
          {language}
        </li>
      );
    });
    return <ul className="languages">{langElements}</ul>;
  }
}

module.exports = Popular;

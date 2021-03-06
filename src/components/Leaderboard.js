import React, { Component } from "react";
import { connect } from "react-redux";

import actions from "../actions";

import { getLeaderboardResults, isLeaderboardLoading } from "../selectors";

const RESULTS_COUNT = 10;
const LEADERBOARDS = {
  time: [2048, 4096, 8192],
  score: ["3x3", "4x4", "5x5"],
};

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedBoard: 2048 };
  }

  componentDidMount() {
    const {selectedBoard} = this.state;
    this.props.fetchResults(selectedBoard);;
  }

  handleLinkClick(value) {
    this.setState({ selectedBoard: value });
    this.props.fetchResults(value);
  }

  renderLeaderboardNav() {
    return (
      <div className="leaderboard-nav">
        <div className="item">
          <i className="fas fa-stopwatch"></i>
          <div className="title">Best Time</div>
          {this.renderLeaderboardLink("time")}
        </div>

        <div className="item">
          <i className="fas fa-trophy"></i>
          <div className="title">Best Score</div>
          {this.renderLeaderboardLink("score")}
        </div>
      </div>
    );
  }

  renderLeaderboardLink(linkValue) {
    return LEADERBOARDS[linkValue].map(value => {
      if (this.state.selectedBoard === value) {
        return (
          <span
            className="selected"
            onClick={() => this.handleLinkClick(value)}
            key={`${linkValue}:${value}`}
          >
            {value}
          </span>
        );
      }

      return (
        <span
          key={`${linkValue}:${value}`}
          onClick={() => this.handleLinkClick(value)}
        >
          {value}
        </span>
      );
    });
  }

  renderResult(pos, name, result) {
    return (
      <div className="item" key={`${pos}:${name}`}>
        <div className="meta">
          <span className="position">{`${pos + 1}.`}</span>
          <span className="name">{name}</span>
        </div>
        <span className="result">{result}</span>
      </div>
    );
  }

  renderEmptyResult(i) {
    return <div className="item" key={`empty:${i}`}></div>;
  }

  renderNoResultMessage() {
    return (
      <div className="item" key={"no-results"}>
        <span className="no-results">
          {"No results yet. Be the first one!"}
        </span>
      </div>
    );
  }

  renderEmptyResults(count) {
    const results = new Array(count).fill(null);
    return results.map((item, i) => {
      return (
        <div className="item" key={`empty:${i}`}></div>
      )
    })
  }

  renderResults() {
    const { selectedBoard, isLoading } = this.state;
    const resultsSelectedBoard = this.props.resultsData[selectedBoard];
    const results = [];

    if (isLoading) {
      return this.renderEmptyResults(RESULTS_COUNT);
    }

    if (resultsSelectedBoard.length === 0) {
      results.push(this.renderNoResultMessage());
    }

    resultsSelectedBoard.forEach((item, i) => {
      const { name, result } = item;
      results.push(this.renderResult(i, name, result));
    });

    const emptyResultsCount = RESULTS_COUNT - results.length;

    results.push(...this.renderEmptyResults(emptyResultsCount));

    return results;
  }

  render() {

    const {isLoading} = this.props;

    return (
      <div className={isLoading ? "leaderboard loading" : "leaderboard"}>
        {this.renderLeaderboardNav()}

        <div className="results">{this.renderResults()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  resultsData: getLeaderboardResults(state),
  isLoading: isLeaderboardLoading(state),
});

export default connect(mapStateToProps, {
  fetchResults: actions.fetchResults,
})(Leaderboard);

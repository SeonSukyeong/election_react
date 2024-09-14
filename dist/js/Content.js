import React from 'react'
import Table from './Table'
import Form from './Form'

class Content extends React.Component {
  render() {
    return (
      <div>
        <Table candidates={this.props.candidates} />
        <hr/>
        { !this.props.hasVoted ?
          <Form candidates={this.props.candidates} castVote={this.props.castVote} /> //투표 안했으면 폼 보여줌
          : null                                                                     //투표 했으면 안보여줌
        }
        <p>현재 접속한 계정 주소: {this.props.account}</p>
      </div>
    )
  }
}

export default Content
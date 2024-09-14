import React from 'react'

class Table extends React.Component {
  render() {
    return (
      <table class='table'>
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>투표수</th>
          </tr>
        </thead>
        <tbody >
          {this.props.candidates.map((candidate) => {
            return(
              <tr>
                <th>{candidate.id.toNumber()}</th>
                <td>{candidate.name}</td>
                <td>{candidate.voteCount.toNumber()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default Table
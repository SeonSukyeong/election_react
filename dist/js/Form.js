import React from 'react'

class from extends React.Component {
  render() {
    return (
      <form onSubmit={(event) => {
        event.preventDefault()
        this.props.castVote(this.candidateId.value)
      }}>
        <div class='form-group'>
          <label>원하는 후보를 선택해주세요.</label>
          <select ref={(input) => this.candidateId = input} class='form-control'>//선택에 대한 참조 배치
            {this.props.candidates.map((candidate) => {//선택한 값의 구성요소에 후보 id를 할당하는 익명함수 호출
              return <option value={candidate.id}>{candidate.name}</option>
            })}//후보를 매핑하여 선택을 구축, 선택 옵션 렌더링
          </select>
        </div>
        <button type='submit' class='btn btn-primary'>투표하기</button>
        <hr />
      </form>
    )
  }
}

export default from

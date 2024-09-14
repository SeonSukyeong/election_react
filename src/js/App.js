//node.js에서 제공하는 라이브러리
import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Election from '../../build/contracts/Election.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'

class App extends React.Component {
  constructor(props) {
    //component state 사용 (to manage our app state)
    super(props)
    this.state = {
      account: '0x0',
       candidates: [],
      hasVoted: false,
      loading: true,//현재 선거중
      voting: false,
      //컴포넌트들, 앱 상태를 관리하는
    }

    //web3 설정 (react <-> blockchain)
    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)

    this.election = TruffleContract(Election)// 중요한 부분!! <generating truffle contract that we can use to interact with>
    //컨트랙트와 FE의 연동을 위해 많은 사람들이 web3를 그 자체로 사용하지만, 별로 선호하지 않는다. 아래 이유
    //1. keep setting the address based on environment
    //2. keep changing the ABI* while you're developing
    //* ABI = abstract binary interface (generate a contract for EVM, Web3와 같은 FE, truffle contract)
    this.election.setProvider(this.web3Provider)

    //binding functions
    this.castVote = this.castVote.bind(this)//cast vote와 같은 내부 문제를 해결하기 위해서 상위 구성 요소에 바인딩함
    this.watchEvents = this.watchEvents.bind(this)
  }

  //blockchain data state와 연동, componentDidMount() = did this component mount and if it did do this stuff
  componentDidMount() {//마운트 기능, 생명주기 같은 건가?
    // TODO: Refactor with promise chain
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.election.deployed().then((electionInstance) => {
        this.electionInstance = electionInstance
        this.watchEvents()
        this.electionInstance.candidatesCount().then((candidatesCount) => {
          for (var i = 1; i <= candidatesCount; i++) {
            this.electionInstance.candidates(i).then((candidate) => {
              const candidates = [...this.state.candidates]
              candidates.push({
                id: candidate[0],
                name: candidate[1],
                voteCount: candidate[2]
              });
              this.setState({ candidates: candidates })
            });
          }
        })
        this.electionInstance.voters(this.state.account).then((hasVoted) => {
          this.setState({ hasVoted, loading: false })//투표했는지 안 했는지 확인 절차
        })
      })
    })
  }//오... 후보자 수를 얻을 때까지 후보자 매핑에서 후보자를 읽으려고 시도할 수 없음
  //스마트 계약의 인스턴트를 얻을 때까지는 접근 불가, 비동기식이므로..

  //그래서 watchEvents가 있는 거야!
  //smart contract와 대화하는 투표 기능을 사용
  //여기에 선거 인스턴스의 복사본이 있고, 후보 id에 있는 후보자 계정을 전달하면
  //여기는 뭐 투표하라는 호출이 없군

  watchEvents() {
    // TODO: trigger event when vote is counted, not when component renders
    this.electionInstance.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      this.setState({ voting: false })
    })
  }

  castVote(candidateId) {
    this.setState({ voting: true })
    this.electionInstance.vote(candidateId, { from: this.state.account }).then((result) =>
      this.setState({ hasVoted: true }) //투표 했으면 가져오는 것인가?
    )
  }

  render() {//테이블 렌더링
    return (
      <div class='row'>
        <div class='col-lg-12 text-center' >
          <h1>선거 결과</h1>
          <br/>
          { this.state.loading || this.state.voting //화면 로딩 또는 투표 중이면
            ? <p class='text-center'>Loading...</p>
            : <Content                              //로딩 중이 아니면
                account={this.state.account}
                candidates={this.state.candidates}
                hasVoted={this.state.hasVoted}
                castVote={this.castVote} />
          }
        </div>
      </div>
    )//얘들은 시간 상태에 의존하겠군
  }
}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)

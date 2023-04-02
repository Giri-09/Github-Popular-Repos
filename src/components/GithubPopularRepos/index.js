import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Write your code here
class GithubPopularRepos extends Component {
  state = {
    activeId: languageFiltersData[0].id,
    dataList: [],
    status: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRepos()
  }

  onSuccess = list => {
    const updatedList = list.map(each => ({
      id: each.id,
      imageUrl: each.avatar_url,
      name: each.name,
      starsCount: each.stars_count,
      forksCount: each.forks_count,
      issuesCount: each.issues_count,
    }))
    this.setState({
      dataList: updatedList,
      status: apiStatusConstants.success,
    })
  }

  getRepos = async () => {
    this.setState({status: apiStatusConstants.inProgress})
    const {activeId} = this.state
    const url = `https://apis.ccbp.in/popular-repos?language=${activeId}`
    const response = await fetch(url)
    console.log(response)
    const data = await response.json()
    if (response.ok) {
      this.onSuccess(data.popular_repos)
    } else {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  clickItem = activeId => {
    this.setState({activeId}, this.getRepos)
    console.log(activeId)
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="image-fail"
      />
      <h1>Something Went Wrong</h1>
    </div>
  )

  renderList = () => {
    const {dataList} = this.state

    return (
      <ul className="data-list">
        {dataList.map(repositoryData => (
          <RepositoryItem
            key={repositoryData.id}
            repositoryData={repositoryData}
          />
        ))}
      </ul>
    )
  }

  renderPage = () => {
    const {status} = this.state
    switch (status) {
      case apiStatusConstants.success:
        return this.renderList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state
    return (
      <div className="bg">
        <h1 className="heading">Popular</h1>
        <ul className="lan-list">
          {languageFiltersData.map(each => (
            <LanguageFilterItem
              key={each.id}
              languagesList={each}
              clickItem={this.clickItem}
              isActive={each.id === activeId}
            />
          ))}
        </ul>
        {this.renderPage()}
      </div>
    )
  }
}

export default GithubPopularRepos

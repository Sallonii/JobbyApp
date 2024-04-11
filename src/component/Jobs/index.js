import {Component} from 'react'

import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const statusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  noJobs: 'NO_JOBS',
}

class Jobs extends Component {
  state = {
    profileData: '',
    profileStatus: statusConstants.initial,
    jobsList: [],
    jobStatus: statusConstants.initial,
    searchInput: '',
    employmentTypeArray: [],
    salaryPackage: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  getJobsList = async () => {
    const {searchInput, employmentTypeArray, salaryPackage} = this.state
    const employmentTypeString = employmentTypeArray.join()

    this.setState({jobStatus: statusConstants.inProgress})
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${salaryPackage}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        ppa: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      if (updatedData.length === 0) {
        this.setState({
          jobStatus: statusConstants.noJobs,
        })
      } else {
        this.setState({
          jobsList: updatedData,
          jobStatus: statusConstants.success,
        })
      }
    } else {
      this.setState({jobStatus: statusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileStatus: statusConstants.inProgress})
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        bio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: formattedData,
        profileStatus: statusConstants.success,
      })
    } else {
      this.setState({profileStatus: statusConstants.failure})
    }
  }

  onChangingSearchValue = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickingSearch = () => {
    this.setState({jobStatus: statusConstants.inProgress}, this.getJobsList)
  }

  renderProfile = () => {
    const {profileData, profileStatus} = this.state
    const {name, profileImageUrl, bio} = profileData

    let profileError
    if (profileStatus === 'SUCCESS') {
      profileError = false
    } else {
      profileError = true
    }
    return (
      <>
        {!profileError && (
          <div className="profile-card">
            <img src={profileImageUrl} alt="profile" className="profile" />
            <h1 className="profile-heading">{name}</h1>
            <p className="profile-description">{bio}</p>
          </div>
        )}
        {profileError && (
          <button
            type="button"
            className="retry-button"
            onClick={this.getProfileDetails}
          >
            Retry
          </button>
        )}
      </>
    )
  }

  onClickingEmploymentType = event => {
    const {employmentTypeArray} = this.state

    const newArray = employmentTypeArray.copyWithin()

    if (newArray.includes(event.target.value)) {
      const index = newArray.indexOf(event.target.value)
      newArray.splice(index, 1)
    } else {
      newArray.push(event.target.value)
    }

    this.setState({employmentTypeArray: newArray}, this.getJobsList)
  }

  onClickingSalaryRange = event => {
    this.setState({salaryPackage: event.target.value}, this.getJobsList)
  }

  renderCategoryList = () => {
    const {employmentTypesList, salaryRangesList} = this.props
    return (
      <>
        <h1 className="category-heading">Type of Employment</h1>
        <ul>
          {employmentTypesList.map(eachType => (
            <li
              className="employment-type-list"
              key={eachType.employmentTypeId}
            >
              <input
                id={eachType.label}
                type="checkbox"
                className="input-element"
                value={eachType.employmentTypeId}
                onClick={this.onClickingEmploymentType}
              />
              <label htmlFor={eachType.label}>{eachType.label}</label>
            </li>
          ))}
        </ul>
        <hr />
        <h1 className="category-heading">Salary Range</h1>
        <ul>
          {salaryRangesList.map(eachType => (
            <li className="employment-type-list" key={eachType.salaryRangeId}>
              <input
                id={eachType.label}
                type="radio"
                className="input-element"
                onClick={this.onClickingSalaryRange}
                value={eachType.salaryRangeId}
              />
              <label htmlFor={eachType.label}>{eachType.label}</label>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    return (
      <ul className="job-list-ul-container">
        {jobsList.map(eachJob => (
          <JobItem jobDetails={eachJob} key={eachJob.id} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" className="retry-button" onClick={this.getJobsList}>
        Retry
      </button>
    </div>
  )

  renderNoJobsList = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderProfileFailure = () => (
    <button
      type="button"
      className="retry-button"
      onClick={this.getProfileDetails}
    >
      Retry
    </button>
  )

  renderProfileSection = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case statusConstants.success:
        return this.renderProfile()
      case statusConstants.inProgress:
        return this.renderLoadingView()
      case statusConstants.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  renderJobsSection = () => {
    const {jobStatus} = this.state
    switch (jobStatus) {
      case statusConstants.success:
        return this.renderJobsList()
      case statusConstants.inProgress:
        return this.renderLoadingView()
      case statusConstants.failure:
        return this.renderFailureView()
      case statusConstants.noJobs:
        return this.renderNoJobsList()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-section-container">
          <div className="profile-and-category-container">
            <div className="jobs-search-input-container mobile-input">
              <input
                className="jobs-search-input-element"
                type="search"
                onChange={this.onChangingSearchValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClickingSearch}
              >
                <span>Search Button</span>
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderProfileSection()}
            <hr />
            {this.renderCategoryList()}
          </div>
          <div className="jobs-container">
            <div className="jobs-search-input-container desktop-input">
              <input
                className="jobs-search-input-element"
                type="search"
                onChange={this.onChangingSearchValue}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClickingSearch}
              >
                <span>Search Button</span>
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsSection()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs

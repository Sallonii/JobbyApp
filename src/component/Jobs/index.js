import {Component} from 'react'

import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

class Jobs extends Component {
  state = {
    profileData: '',
    profileError: false,
    jobsList: [],
    jobListError: false,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  getJobsList = async () => {
    const jobsUrl = 'https://apis.ccbp.in/jobs'
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
      this.setState({jobsList: updatedData, jobListError: false})
    } else {
      this.setState({jobListError: true})
    }
  }

  getProfileDetails = async () => {
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
      this.setState({profileData: formattedData, profileError: false})
    } else {
      this.setState({profileError: true})
    }
  }

  render() {
    const {employmentTypesList, salaryRangesList} = this.props
    const {profileData, profileError, jobsList, jobListError} = this.state
    const {name, profileImageUrl, bio} = profileData
    return (
      <>
        <Header />
        <div className="jobs-section-container">
          <div className="profile-and-category-container">
            {!profileError && (
              <div className="profile-card">
                <img src={profileImageUrl} alt="profile" className="profile" />
                <h1 className="profile-heading">{name}</h1>
                <p className="profile-description">{bio}</p>
              </div>
            )}
            {profileError && (
              <button type="button" className="retry-button">
                Retry
              </button>
            )}
            <hr />
            <h1 className="category-heading">Type of Employment</h1>
            <div>
              {employmentTypesList.map(eachType => (
                <li
                  className="employment-type-list"
                  key={eachType.employmentTypeId}
                >
                  <input
                    id={eachType.label}
                    type="checkbox"
                    className="input-element"
                  />
                  <label htmlFor={eachType.label}>{eachType.label}</label>
                </li>
              ))}
            </div>
            <hr />
            <h1 className="category-heading">Salary Range</h1>
            <div>
              {salaryRangesList.map(eachType => (
                <li
                  className="employment-type-list"
                  key={eachType.salaryRangeId}
                >
                  <input
                    id={eachType.label}
                    type="checkbox"
                    className="input-element"
                  />
                  <label htmlFor={eachType.label}>{eachType.label}</label>
                </li>
              ))}
            </div>
          </div>
          <div className="jobs-container">
            <div className="jobs-search-input-container">
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
              >
                <span>Search Button</span>
                <BsSearch className="search-icon" />
              </button>
              <input className="jobs-search-input-element" type="text" />
            </div>
            <div className="job-list-ul-container">
              {jobsList.map(eachJob => (
                <JobItem jobDetails={eachJob} key={eachJob.id} />
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs

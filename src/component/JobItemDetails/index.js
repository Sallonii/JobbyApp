import {Component} from 'react'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {FaStar, FaBriefcase} from 'react-icons/fa'
import {BsBoxArrowUpRight} from 'react-icons/bs'

import {IoLocationSharp} from 'react-icons/io5'

import Header from '../Header'

import './index.css'

const jobsDetailsConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN PROGRESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetails: [],
    jobItemStatus: jobsDetailsConstant.initial,
    similarJobDetails: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  onSuccess = data => {
    const jobDetails = data.job_details
    const similarJobs = data.similar_jobs

    const updatedSkills = jobDetails.skills.map(eachItem => ({
      imageUrl: eachItem.image_url,
      name: eachItem.name,
    }))

    const formattedJobData = {
      id: jobDetails.id,
      companyLogoUrl: jobDetails.company_logo_url,
      employmentType: jobDetails.employment_type,
      jobDescription: jobDetails.job_description,
      location: jobDetails.location,
      ppa: jobDetails.package_per_annum,
      rating: jobDetails.rating,
      title: jobDetails.title,
      companyWebsiteUrl: jobDetails.company_website_url,
      skills: updatedSkills,
      lifeAtCompany: {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      },
    }

    const updatedSimilarJobsData = similarJobs.map(eachItem => ({
      id: eachItem.id,
      companyLogoUrl: eachItem.company_logo_url,
      employmentType: eachItem.employment_type,
      jobDescription: eachItem.job_description,
      location: eachItem.location,
      rating: eachItem.rating,
      title: eachItem.title,
    }))

    this.setState({
      jobItemDetails: formattedJobData,
      similarJobDetails: updatedSimilarJobsData,
      jobItemStatus: jobsDetailsConstant.success,
    })
  }

  getJobItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({jobItemStatus: jobsDetailsConstant.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSuccess(data)
    } else {
      this.setState({jobItemStatus: jobsDetailsConstant.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSimilarJobs = () => {
    const {similarJobDetails} = this.state

    return (
      <ul className="similar-jobs-container">
        {similarJobDetails.map(eachJob => (
          <li className="similar-job-card" key={eachJob.id}>
            <div className="logo-and-title-container">
              <img
                src={eachJob.companyLogoUrl}
                alt="job details company logo"
                className="company-logo-url"
              />
              <div>
                <h1 className="job-title">{eachJob.title}</h1>
                <div className="rating-container">
                  <FaStar color="yellow" />
                  <p>{eachJob.rating}</p>
                </div>
              </div>
            </div>
            <hr />
            <h1>Description</h1>
            <p>{eachJob.jobDescription}</p>
            <div className="location-and-type-container">
              <div className="icon-container">
                <IoLocationSharp />
                <p>{eachJob.location}</p>
              </div>
              <div className="icon-container">
                <FaBriefcase />
                <p>{eachJob.employmentType}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderJobDetails = () => {
    const {jobItemDetails} = this.state

    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      ppa,
      rating,
      title,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobItemDetails

    const {description, imageUrl} = lifeAtCompany

    return (
      <>
        <li className="job-li-item">
          <div className="logo-and-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo-url"
            />
            <div>
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <FaStar color="yellow" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="jobs-middle-section">
            <div className="location-and-type-container">
              <div className="icon-container">
                <IoLocationSharp />
                <p>{location}</p>
              </div>
              <div className="icon-container">
                <FaBriefcase />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{ppa}</p>
          </div>
          <hr />
          <div className="description-and-website-link-container">
            <h1 className="jobs-description-heading">Description</h1>
            <a
              href={companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="visit-link"
            >
              Visit
              <BsBoxArrowUpRight className="upright-arrow" />
            </a>
          </div>
          <p className="jobs-description">{jobDescription}</p>
          <h1>Skills</h1>
          <ul className="skill-ul-container">
            {skills.map(eachSkill => (
              <li className="skill-li-item" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-logo"
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div className="company-description-and-image">
            <p>{description}</p>
            <img src={imageUrl} alt="life at company" />
          </div>
        </li>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        {this.renderSimilarJobs()}
      </>
    )
  }

  renderJobItem = () => {
    const {jobItemStatus} = this.state

    switch (jobItemStatus) {
      case jobsDetailsConstant.inProgress:
        return this.renderLoadingView()
      case jobsDetailsConstant.success:
        return this.renderJobDetails()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-main-container">{this.renderJobItem()}</div>
      </>
    )
  }
}

export default JobItemDetails

import {FaStar, FaBriefcase} from 'react-icons/fa'

import {IoLocationSharp} from 'react-icons/io5'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    ppa,
    rating,
    title,
  } = jobDetails
  return (
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
      <h1 className="jobs-description-heading">Description</h1>
      <p className="jobs-description">{jobDescription}</p>
    </li>
  )
}

export default JobItem

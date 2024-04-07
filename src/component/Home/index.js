import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-container">
      <h1 className="home-heading">Find The Job That Fits Your Life</h1>
      <p className="home-description">
        Millions of people are searching for jobs, salary infromation, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <button type="button" className="find-jobs-button">
        <Link to="/jobs">Find Jobs</Link>
      </button>
    </div>
  </>
)

export default Home

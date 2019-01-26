import React, { Component } from 'react'
// import PreviewPage from './PreviewPage'
import './app.css'

const joi = require('joi');

const JobList = (props) => {
    return (
      <table>
        <tbody>
        {props.jobs.map((job) => {
          return (
            <tr className="JobList" key={job.id} >
            <td onClick={e => props.OnJobSelected(e, job)} ></td>
              <td>{job.fname}</td>
              <td>{job.lname}</td>
              <td>{job.wsite}</td>
              <td>{job.email}</td>
              <td>{job.phone}</td>
              <td>{job.count}</td>
              </tr>
        )})}
        </tbody>
      </table>
  )
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      id: '',
      fname: '',
      lname: '',
      wsite: '',
      email: '',
      phone: '',
      count: 0,
      notes: '',
      datalist: [],
      errmessage: ''
    }

    //Joi Schema
    this.validState = joi.object().keys({
      id: joi.string().allow('',null),
      fname: joi.string().allow('',null),
      lname: joi.string().allow('',null),
      wsite: joi.string().allow('',null),
      email: joi.string().allow('',null),
      phone: joi.number().allow('',null),
      count: joi.number().allow('',null),
      notes: joi.string().allow('',null)
      // fname: joi.string().regex(/^[a-zA-Z ]$/).allow('',null),
      // lname: joi.string().regex(/^[a-zA-Z ]$/).allow('',null),
      // website: joi.string().regex(/^[a-zA-Z///:/. ]$/).allow('',null),
      // email: joi.string().email({ minDomainAtoms: 2 }).allow('',null),
      // phone: joi.string().regex(/^[0-9/-/. ]{0,10}$/).allow('',null),
      // count: joi.number().min(0).max(10).allow('',null),
      // notes: joi.string().allow('',null)
    })

    this.loadJobs = this.loadJobs.bind(this)
    this.insertData = this.insertData.bind(this)
    this.updateData = this.updateData.bind(this)
    this.saveJobHandler = this.saveJobHandler.bind(this)
    this.deleteJobHandler = this.deleteJobHandler.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  loadJobs() {
    console.log("Loading Jobs...")
    fetch(`http://localhost:9000/jobs`,{
      method: "GET"
    })
    .then(res => res.json())
    .then(response => {
      this.setState({datalist: response})
    })
    .catch(err=> {
      this.setState({errmessage: err.message})
    })
    console.log("Done Loading Jobs...")
  }

  componentDidMount() {
    this.loadJobs();
  }

    insertData() {
    console.log("Inserting...")
    const test= {
      fname: this.state.fname,
      lname: this.state.lname,
      wsite: this.state.wsite,
      email: this.state.email,
      phone: this.state.phone,
      count: this.state.count,
      notes: this.state.notes
    }
    console.log(test)

    fetch("http://localhost:9000/jobs",{
      method: "POST",
      body: test
        // fname: this.state.fname,
        // lname: this.state.lname,
        // wsite: this.state.wsite,
        // email: this.state.email,
        // phone: this.state.phone,
        // count: this.state.count,
        // notes: this.state.notes
      // }
    })
    .then(res => res.json())
    .then(response => { 
      console.log("Calling Load Jobs...")
      this.loadJobs();
    })
    .catch(err=> {
      this.setState({errmessage: err.message})
    })
  }

  updateData() {
    console.log("Updating...")
    fetch("http://localhost:9000/jobs/{this.state.id}",{
      method: "PUT"
    })
    .then(res => res.json())
    .then(response => { 
      this.setState({datalist: response})
    })
    .catch(err=> {
      this.setState({errmessage: err.message})
    })
  }

  saveJobHandler(event) {
    //Validate the entered data
    // let isValid = joi.validate(this.state, this.validState, {allowUnknown: true})
    // if (isValid.error !== null) {
    //   console.log(isValid.error)
    // } else {
    // Save the job
    event.preventDefault();
    console.log("saving= " + this.state.id);
      (this.state.id !== '') ? this.updateData() : this.insertData()
    // }
  }

  deleteJobHandler() {
    // Delete the job
    fetch("http://localhost:9000/jobs",{
      method: "DELETE"
    })
    .then(res => res.json())
    .then(response => { 
      this.setState({datalist: response})
    })
    .catch(err=> {
      this.setState({errmessage: err.message})
    })
  }

  handleChange= (event) => {

    //save old value in case does not pass validation
    // let oldValue = this.state[event.target.value]
    // let oldValue = event.value
    // this.setState({[event.target.name]: event.value})

    // let isValid = joi.validate(this.state, this.validState, {allowUnknown: true})
    // if (isValid.error !== null) {
      // console.log(isValid.error)
      // this.setState({[event.target.name]: oldValue})
      this.setState({[event.target.name]: event.target.value})
    // }
  }

  userInput() {
    return (
      <form className="Input">
        <div>
          { (this.state.errmessage) ? this.state.errmessage : null}
        </div>
        <label>First Name: </label>
        <input type="text" name="fname" value={this.state.fname} onChange={this.handleChange}/>
        <br></br>
        <label>Last Name: </label>
        <input type="text" name="lname" value={this.state.lname} onChange={this.handleChange}/>
        <br></br>
        <label>Web Site: </label>
        <input type="text" name="wsite" value={this.state.wsite} onChange={this.handleChange}/>
        <br></br>
        <label>E-mail: </label>
        <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
        <br></br>
        <label>Phone: </label>
        <input type="text" name="phone" value={this.state.phone} onChange={this.handleChange}/>
        <br></br>
        <label>Contact Count: </label>
        <input type="text" name="count" value={this.state.count} onChange={this.handleChange}/>
        <br></br>
        <label>Notes: </label>
        <input type="text" name="notes" value={this.state.notes} onChange={this.handleChange}/>
        <br></br>
        <button onClick={(e) => this.saveJobHandler(e)}>Save</button>
        <button onClick={() => this.deleteJobHandler()}>Delete</button>
      </form>
    )
  }

  selectJobHandler(e, job) {
    // Take selected job from listing and move it above to view/edit
    this.setState({id:job.id})
    this.setState({fname:job.fname})
    this.setState({lname:job.lname})
    this.setState({wsite:job.wsite})
    this.setState({email:job.email})
    this.setState({phone:job.phone})
    this.setState({count:job.count})
    this.setState({notes:job.notes})
  }

  render() {
    return (
    <div className="App">
      <main>
        <section>
          {this.userInput()}
        </section>
        <section>
          <div className="JobList">
            <label>Id</label>
            <label>Name, First Last</label>
            <label>Website</label>
            <label>Email</label>
            <label>phone</label>
            <label>Count</label>
          </div>
          <JobList jobs={this.state.datalist} OnJobSelected={this.selectJobHandler} />
        </section>
      </main>
      <footer>
          <p> &copy; Ken Mason 2018-2019 </p>
      </footer>
    </div>
    )
  }
}

export default App

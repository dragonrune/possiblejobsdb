import React, { Component } from 'react'
// import PreviewPage from './PreviewPage'
import './app.css'

const joi = require('joi');

class App extends Component {

  constructor() {
    super();
    this.state={
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

    this.handleChange = this.handleChange.bind(this)
    this.populateList = this.populateList.bind(this)
    this.dataList = this.dataList.bind(this)
    this.insertData = this.insertData.bind(this)
    this.updateData = this.updateData.bind(this)
    this.saveJobHandler = this.saveJobHandler.bind(this)
    this.deleteJobHandler = this.deleteJobHandler.bind(this)
  }

  populateList(res) {
    const contactlist = res.jobs.map(
      (dl, i) => {
          return (
            <div className="Datalist" key={i}>
              <button onClick={() => this.selectJobHandler(dl.jobs[i])}>{dl.jobs[i].id}</button>
              <div>{dl.jobs[i].fname}</div>
              <div>{dl.jobs[i].lname}</div>
              <div>{dl.jobs[i].wsite}</div>
              <div>{dl.jobs[i].email}</div>
              <div>{dl.jobs[i].phone}</div>
              <div>{dl.jobs[i].count}</div>
            </div>
          )
        }
      )
    this.setState({datalist : contactlist})
    // this.setState({fname:response.jobs[0].fname})
    // this.setState({lname:response.jobs[0].lname})
    // this.setState({wsite:response.jobs[0].wsite})
    // this.setState({email:response.jobs[0].email})
    // this.setState({phone:response.jobs[0].phone})
    // this.setState({count:response.jobs[0].count})
    // this.setState({notes:response.jobs[0].notes})
  }

  componentDidMount() {
    // console.log("In GET")
    fetch("http://localhost:9000/jobs",{
      method: "GET"
    })
    .then(res => res.json())
    .then(response => {
      this.setState({datalist : response})
      console.log(this.state.datalist)
    })
    // .catch(err=> {
    //   this.setState({errmessage: err.message})
    // })
  }

  insertData() {
    fetch("http://localhost:9000/jobs",{
      method: "INSERT"
    })
    .then(res => res.json())
    .catch(err=> {
      this.setState({errmessage: err.message})
    })
    .then(response => { 
      this.populateList(response)
    })
  }

  updateData() {
    fetch("http://localhost:9000/jobs",{
      method: "UPDATE"
    })
    .then(res => res.json())
    .catch(err=> {
      this.setState({errmessage: err.message})
    })
    .then(response => { 
      this.populateList(response)
    })
  }

  saveJobHandler() {
    // Save the job
    (this.state.id !== '') ? this.updateData() : this.insertData()
  }

  deleteJobHandler() {
    // Delete the job
    fetch("http://localhost:9000/jobs",{
      method: "DELETE"
    })
    .then(res => res.json())
    .catch(err=> {
      this.setState({errmessage: err.message})
    })
    .then(response => { 
      this.populateList(response)
    })
  }

  handleChange= (event) => {

    //save old value in case does not pass validation
    let oldValue = this.state[event.target.name]
    this.setState({[event.target.name]: event.value})
    // this.setState({[event.target.name]: event.target.value})

    let isValid = joi.validate(this.state, this.validState, {allowUnknown: true})
    if (isValid.error !== null) {
      // console.log(isValid.error)
      this.setState({[event.target.name]: oldValue})
    }
  }

  userInput() {
    return (
      <div className="Input">
        <div>
          { (this.state.errmessage) ? this.state.errmessage : ''}
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
        <button onClick={() => this.saveJobHandler()}>Save</button>
        <button onClick={() => this.deleteJobHandler()}>Delete</button>
      </div>
    )
  }

  selectJobHandler(job) {
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

  dataList() {
    this.state.datalist.map((job) => {
          return (
            <div className="Datalist" key={job.id}>
              <button onClick={() => this.selectJobHandler(job)}>{job.id}</button>
              <div>{job.fname}</div>
              <div>{job.lname}</div>
              <div>{job.wsite}</div>
              <div>{job.email}</div>
              <div>{job.phone}</div>
              <div>{job.count}</div>
            </div>
          )
    })
    console.log(this.state.datalist)
  }

  render() {
    return (
    <div className="App">
      <main>
        <section>
          {this.userInput()}
        </section>
        <section>
          {this.dataList()}
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

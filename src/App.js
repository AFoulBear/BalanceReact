import React, {Component} from 'react';
import './App.css';
import './main.css';
import axios from 'axios';

const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

const formValid = ({formErrors, ...rest }) => {
  let valid = true;

  //Validate form errors beign null
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false)
  });

  //Iterates over the values and check for null
  Object.values(rest).forEach(val => {
    val === null && (valid = false)
  });

  return valid;
}



class App extends Component {


  constructor(props){
    super(props);

    this.state = {
      firstName:null,
      lastName:null,
      email:null,
      formErrors: {
        firstName:"",
        lastName:"",
        email:""
      }
    };

    //this.handelSubmit = this.handelSubmit.bind(this);
  }

  handelSubmit = e => {
    e.preventDefault();

    if(formValid(this.state)) {
      console.log(`
          --SUBMITING--
          First Name : ${this.state.firstName}
          Last Name: ${this.state.lastName}
          Email: ${this.state.email}
      `)
      var data = {
        SubmissionId: "",
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email
      }
      console.log(JSON.stringify(data))

      axios.post(`https://ebrownbalanceapi.azurewebsites.net/api/Submission`, data )
        .then(res => {
          console.log(res);
          console.log(res.data);
        });

      /*
      fetch("https://ebrownbalanceapi.azurewebsites.net/api/Submission",{
        method: 'post',
        body: JSON.stringify(data),
        mode: 'no-cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers:{
          'Content-type': 'application/json'
        },
        redirect: 'follow', 
        referrer: 'no-referrer'
        
      })*/
    } else {
      console.error('FORM INVALID - DISPLAY ERROR MESSAGE')
    }
  };

  handelChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = this.state.formErrors;

    switch(name){
      case'firstName':
        formErrors.firstName = value.length < 2 ? 'minimum 2 characters required' : "";
        break;
      case'lastName':
        formErrors.lastName = value.length < 2 ? 'minimum 2 characters required' : "";
        break;
      case'email':
        formErrors.email = emailRegex.test(value) ? '' : 'please enter a valid email';
        break;
      default: 
        break;
    }

    this.setState({formErrors,[name]: value}, ()=> console.log(this.state))
  }

  render() {

    const { formErrors } = this.state;

    return (
      <div className="wrapper">
        <div className="inner-wrapper row col-sm-8 offset-sm-2">
          <div className="col-sm-12 offset-sm-1">
            
            <h3>Submit Your Entry</h3>
              <p>Please fill out the following form. All fields are required.</p>
              <form onSubmit={this.handelSubmit} noValidate>

                <div className="firstName form-row">
                  <div className="form-group col-sm-2">
                    <input 
                      name="firstName" 
                      type="text"
                      className={formErrors.firstName.length > 0 ? "form-control border border-danger" : "form-control"} 
                      placeholder="First Name"
                      noValidate
                      onChange={this.handelChange}/>
                  </div>
                  <div className="form-group col-sm-3">
                    <input 
                        name="lastName" 
                        type="text"
                        className={formErrors.lastName.length > 0 ? "form-control border border-danger" : "form-control"} 
                        placeholder="Last Name"
                        noValidate
                        onChange={this.handelChange}/>
                    </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-sm-5">
                    <input 
                        name="email" 
                        type="text"
                        className={formErrors.email.length > 0 ? "form-control border border-danger" : "form-control"} 
                        placeholder="Email"
                        noValidate
                        onChange={this.handelChange}/>
                  </div>
                </div>

                <div className="form-row">
                  <div className="col-sm-3">
                    <button type="submit" className="btn btn-primary btn-lg btn-block">Submit</button>
                  </div>

                </div>
                {formErrors.firstName.length > 0 && (
                    <span className="errorMessage">{formErrors.firstName}</span>
                  )}
                {formErrors.lastName.length > 0 && (
                  <span className="errorMessage">{formErrors.lastName}</span>
                )}
                {formErrors.email.length > 0 && (
                  <span className="errorMessage">{formErrors.email}</span>
                )}
              </form>

          </div>

        </div>
      </div>
    );
  }
}

export default App;

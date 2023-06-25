import { useState } from 'react';
import {Form, Button} from 'react-bootstrap';
import {  Alert, Col, Row } from 'react-bootstrap';
import {Navigate } from 'react-router-dom'

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  
  const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = { username, password };
      
      props.login(credentials)
      .catch((err) => { 
        setErrorMessage(err.error);
      });;
  };

  return (
    <Row className="vh-100 justify-content-md-center">
    <Col md={4} >
    <i className="pb-3">login to edit your pages</i>
    <Form onSubmit={handleSubmit}>
   
      <Form.Group className="mb-3" controlId='username'>
          <Form.Label>email</Form.Label>
          <Form.Control type='email' 
          value={username} placeholder="test@polito.it"
          onChange={ev => setUsername(ev.target.value)} 
          required={true} />
      </Form.Group>

      <Form.Group className="mb-3" controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' 
          value={password} placeholder="Enter the password."
          onChange={ev => setPassword(ev.target.value)} 
          required={true} minLength={6}/>
      </Form.Group>

      <Button className="mt-3" type="submit">Login</Button>
  </Form>
  </Col>
  </Row>
  )
};

function LogoutButton(props) {
  return(
    
    <Button variant='outline-light' onClick={props.logout}>Logout</Button>
  )
}

export { LoginForm, LogoutButton };
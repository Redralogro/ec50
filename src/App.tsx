import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import {Button, Container,Row, Col, Alert, Form}   from 'react-bootstrap';



export default class App extends Component <any,any>{
  static displayName = App.name;
  render(){  
    return (
      <div className="App" style={{ backgroundImage: "http://ctsv.hust.edu.vn/img/BK.jpg" }}>
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <Row className=''>
              <Col> <Button as="a" variant="primary">
              Chọn file excel
            </Button>
            </Col>

              <Col><Button as="a" variant="success">Tính toán</Button></Col>
            </Row>
          {/* <p>
            Edit <code>src/App.tsx</code> Ahihi.
          </p> */}
          {/* <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> */}
        </header>
      </div>
    );
  }
}
// function App() {
  
// }

// export default App;

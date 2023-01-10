import React from 'react';
import './App.css';
import { Component } from 'react';
import {Button, Container,Row, Col, Alert, Form}   from 'react-bootstrap';
// import {ExcelRenderer, OutTable} from 'react-excel-renderer'
import axios from 'axios';
import PRChart  from './FRChart'
import { read, utils, writeFile } from 'xlsx';

interface data_chem {
  Ca: number;
  Mg: number;
  Na: number;
  K: number;
  H: number;
  EC50: number;
}


export default class App extends Component <any,any>{
  static displayName = App.name;
  constructor(props:any) {
    super(props);
    this.loadExcelFile = this.loadExcelFile.bind(this);
    this.solve = this.solve.bind(this);
  }
  state = {name: '', file: '',f:[],r2:[],f_index:0.0, r2_max:0.0, pres:[]};
  render(){  
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <Container>
            <Row><h1><p style ={{fontSize:'6rem', color:'azure'}}>HanoiBLM</p></h1></Row>
            <Row className='col-md-12'>
              <Col>              
                <Row  style={{margin: "auto"}}>
                  {/* <input type="file" name="file" /> */}
                  <Col>
                  <Form.Group controlId="formFile" className="mb-3">
                    {/* <Form.Label>Default file input example</Form.Label> */}
                    <Form.Control type="file" style ={{width:'16rem'}} onChange={this.loadExcelFile} accept='.xlsx' />
                  </Form.Group>
                  </Col>
                  
                  {/* <Col className='col-md-3'> <Button as="a" variant="primary">Chọn file excel</Button></Col> */}
                  <Col className='col-md-3' style={{marginLeft: '-1.22rem'}}><Button as="a" variant="success" onClick={this.solve}>Calculate</Button></Col>
                </Row>
                <Row style={{margin: "auto"}}>
                  <PRChart r2={this.state.r2} f = {this.state.f} />
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col><p style ={{fontSize:'1.5rem', color:'azure'}}>R2 max: {this.state.r2_max}</p> </Col>
                  <Col> <p style ={{fontSize:'1.5rem', color:'azure'}}>F: {this.state.f_index}</p>  </Col>
                </Row>
                <Row>
                  <table className='table table-hover '><thead className='thead-dark' style= {{color:'white'}}>
                    <tr>
                    <th>Ca</th>
                    <th>Mg</th>
                    <th>Na</th>
                    <th>K</th>
                    <th>H</th>
                    <th>EC50</th>
                    </tr>
                    </thead>
                  <tbody style= {{color:'white',fontSize: '1rem'}}>
                  {
                  this.state.pres.map(pres => (<tr>
                      <td>{pres['Ca']}</td>
                      <td>{pres['Mg']}</td>
                      <td>{pres['Na']}</td>
                      <td>{pres['K']}</td>
                      <td>{pres['H']}</td>
                      <td>{pres['EC50']}</td>
                    </tr>))
                  }
                  </tbody></table>
                </Row>
              </Col>
            </Row>
            </Container>

        </header>
      </div>
    );
  }
//style="background:linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('BK.jpg');"
  async loadExcelFile(event:any) {
    const file = event.target.files[0]
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      var data = new Uint8Array(reader.result as ArrayBuffer);
      const wb = read(data);
      const ws = utils.sheet_to_json<data_chem>(wb.Sheets[wb.SheetNames[0]]);
      // console.log(ws);
      await this.setState({name: file.name, file: file, pres: ws},()=>{
        console.log(this.state.pres)
      });

    }
    
    
    
    // const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    
  }

  async solve(){
    const formData = new FormData();
    formData.append("name",this.state.name);
    formData.append("file", this.state.file);
    // console.log("result:", formData)
    await  axios
    .post("http://127.0.0.1:8000/ec50-cal/", formData)
    .then(async (res) => {
      await this.setState({f:res.data.f_list,r2:res.data.r2,f_index:res.data.f_max, r2_max:res.data.r2_max},()=>{
        console.log(this.state)
      })
    })
    .catch((err) => alert("File Upload Error"))
  }
}

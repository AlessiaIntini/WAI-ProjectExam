import { useState} from 'react'
import {Form,Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
function TitleForm(props) {
    const [titleP,setTitleP]=useState('')
    const handleTitle=()=>{

    }
    return(
        
        <Form >
        <Form.Group className='mb-3'>
        <Form.Label>Title of page</Form.Label>
        <Form.Control type="text" minLength={2} required={true} value={titleP} onChange={(event) => setTitleP(event.target.value)}></Form.Control>
        </Form.Group>
        <><Button variant="primary" type="submit" >Set</Button> 
        <Link to='..' relative='path' className='btn btn-danger'>Cancel</Link></>
        </Form>

    )
}
export default TitleForm;
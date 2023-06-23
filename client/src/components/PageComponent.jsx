import dayjs from 'dayjs';
//import all images
import Rome from '../image/Rome.jpg'
import Pizza from '../image/Pizza.jpg'
import Game from '../image/Game.jpg'
import Dog from '../image/Dog.jpg'
import Garden from '../image/Garden.jpg'

import { Table, Form } from 'react-bootstrap'
import { Card,Button } from 'react-bootstrap';
import { useState } from 'react'
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import {Page,Block} from '../Page'
import API from '../API';
import { useEffect} from 'react'

function PageTable(props){

  useEffect(()=>{
    //get all the pages from API
    const getPages=async()=>{
    let pages= await API.getPages();
    props.setPages(pages);
    }
    //call function that just create now
    getPages();
  },[]);

   return(

    <Container fluid="xxl">
      <h1>Welcome to CMSMALL!</h1>
      <p className='lead'>We now have {props.pages.length} pages available.</p>
      
      {!props.loggedIn? <></>:<Link to='/pages'><Button variant="secondary" size="lg" >Add new Page</Button></Link>}
     {/* {!props.loggedIn? <Button variant="secondary" size="lg" disabled >Add new Page</Button>:<Button variant="secondary" size="lg" >Add new Page</Button>}
  */}
   {props.pages.map((page)=><PageRow setLastId={props.setLastId} pageData={page} key={page.id_p} loggedIn={props.loggedIn} user={props.user}/>)} 
    </Container>
 
   );
  }

  function PageRow(props){
    const [open, setOpen] = useState(false);
    let now = dayjs().format("YYYY-MM-DD");

  
      return(
        
        <Row>
        <Button
        variant='light' size="lg"
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
       class="text-left "
      >
       <h2 onChange={props.setLastId(props.pageData.id_p+1)}>{props.pageData.title}</h2>
      </Button>
      <Collapse in={open}>
      <Card border="dark">
        <Card.Body>
        <Card.Text align='left'>
        <i >Created by: {props.pageData.author}</i>
        {props.pageData.blocks.map((block)=><BlockRow blockData={block} key={block.id_b}/>)} 
        <p>{!props.pageData.publicationDate ? 'It is a draft':<></>}</p>
        <p>{props.pageData.publicationDate && props.pageData.publicationDate>now ?'publication of this page is planned in the future on '+dayjs(props.pageData.publicationDate).format("YYYY-MM-DD"):<></>}
        {props.pageData.publicationDate&& props.pageData.publicationDate<now?
        'Publication date: '+dayjs(props.pageData.publicationDate).format("YYYY-MM-DD"):<></>}</p>
        </Card.Text>
        <table align='center'>
        <tbody>
        <tr>
       
       {props.loggedIn && (props?.user?.name==props.pageData.author||props?.user?.role=='admin')? <th><Link to={`/pages/${props.pageData.id}`} state={props.pageData.serialize()} className='btn btn-primary' ><i class="bi bi-pencil"></i></Link></th>:<></>}
        </tr>
        </tbody>
        </table>
        </Card.Body>
        <Card.Footer className="text-muted"> <p>Creation date: {dayjs(props.pageData.creationDate).format("YYYY-MM-DD")}</p></Card.Footer>
        </Card>
      </Collapse>

        </Row>
        
      );
}
function BlockRow(props){
  const [image,setImage]=useState({"Rome":Rome,"Pizza":Pizza,"Dog":Dog,"Game":Game,"Garden":Garden})
  const content=props.blockData.content;
  return(
    <>
  {props.blockData.type=='header'?<Card.Header><h1>{content}</h1></Card.Header>:<></>}
  {props.blockData.type=='image'? <Card.Img variant="top" src={image[content]}/>:<></>}
  
  {props.blockData.type=='paragraph'?
  <Card.Body>
        <blockquote className="blockquote mb-0">
          <p>{' '}{content}{' '}</p>
        </blockquote>
      </Card.Body>:
      <></>
  } 

  </>
  )
}
export default PageTable



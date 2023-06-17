import dayjs from 'dayjs';
import { Table, Form } from 'react-bootstrap'
import { Card,Button } from 'react-bootstrap';
import { useState } from 'react'
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';


function PageTable(props){

   return(

    <Container fluid="xxl">
      <h1>Welcome to CMSMALL!</h1>
      <p className='lead'>We now have {props.pages.length} pages available.</p>

      {!props.loggedIn? <></>:<Button variant="secondary" size="lg" >Add new Page</Button>}
     {/* {!props.loggedIn? <Button variant="secondary" size="lg" disabled >Add new Page</Button>:<Button variant="secondary" size="lg" >Add new Page</Button>}
  */}
       {props.pages.map((page)=><PageRow pageData={page} key={page.id} loggedIn={props.loggedIn}/>)} 
    </Container>
 
   );
  }

  function PageRow(props){
    const [open, setOpen] = useState(false);
    let now = dayjs().format("YYYY-MM-DD");
      return(
        <>
     
        <Row>
        <Button
        variant='light' size="lg"
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
       class="text-left "
      >
       <h2>{props.pageData.title}</h2>
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
       {!props.loggedIn? <></>:<th><Button variant='dark'><i class="bi bi-pencil"></i><Link to={`/pages/${props.id}`}></Link></Button></th>}
        {!props.loggedIn? <></>: <th><Button variant='dark' ><i class="bi bi-scissors" ></i></Button></th>}
        </tr>
        </tbody>
        </table>
        </Card.Body>
        <Card.Footer className="text-muted"> <p>Creation date: {dayjs(props.pageData.creationDate).format("YYYY-MM-DD")}</p></Card.Footer>
        </Card>
      </Collapse>

        </Row>
        </>
      );
}
function BlockRow(props){
const content=props.blockData.content;
  return(
    <>
  {props.blockData.type=='header'?<Card.Header><h1>{content}</h1></Card.Header>:<></>}
  {props.blockData.type=='image'? <Card.Img variant="top" src={`${content}/50px50`}/>:<></>}
  {props.blockData.type=='paragraph'?
  <Card.Body>
        <blockquote className="blockquote mb-0">
          <p>
            {' '}
            {content}{' '}
          </p>
        </blockquote>
      </Card.Body>:<></>
  } 

  </>
  )
}
export default PageTable



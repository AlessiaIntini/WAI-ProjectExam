import { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { Form, Button, Alert,Col,Card } from 'react-bootstrap';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import {Page,Block} from '../Page'
import API from '../API';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import FormCheck from 'react-bootstrap/FormCheck'

function PageForm(props){
    const location=useLocation();
    const editablePage=location.state;
    const navigate = useNavigate();
    const now=new Date();
    const [isShown, setIsShown] = useState(false);

    const [typeB,setTypeB]=useState('')

    let i=0;
    const [waiting, setWaiting] = useState(false);
    const [id,setId]=useState(editablePage? editablePage.id:-1)
    const [title,setTitle]=useState(editablePage?editablePage.title:'')
    const [author,setAuthor]=useState(props.user.name)
    const [creationDate,setCreationDate]=useState(now)
    const [publicationDate,setpublicationDate]=useState(editablePage?editablePage.publicationDate:'');
    const [blocks,setBlock]=useState([])

    const [id_b,setIdB]=useState('60');
    const [content,setContent]=useState('');
    const [page_id,setPageid]=useState(-1);
    
    const onTypeBlockChange=({target:{value}})=>{
      setTypeB(value);
    };
    
    const handleSubmit=(event)=>{
        event.preventDefault(); 
        const page=new Page(id,title,author,creationDate,publicationDate,blocks);
        setWaiting(true);
        setPageid(page.id);
        if(editablePage) {
            // API.updateAnswer(answer)
            //   .then(() => navigate(`/questions/${questionId}`));
            //   //.catch() handle any errors from the server
          }
          else {
            // add the page
            API.addPage(page)
              .then(() => navigate(`/pages`));
              //.catch() handle any errors from the server
          }
    }

    const handleSubmitBlock=()=>{
      //event.preventDefault();
      const block=new Block(id_b,typeB,content);
      
      setBlock( pre => [...pre,{id_b:id_b+1,type:typeB,content:block.content,page_id:page_id}]);
      setIsShown(true);
      // setBlock(oldList =>{
      //   const list=oldList.map((item)=>{
      //     if(item.id_b){
      //       return {id_b:item.id_b,type:item.type, content:item.content};
      //     }else{
      //       return item;
      //     }
      //   })
      //   return list;
      // });
     
    }
   


    return(
    <>
{waiting && <Alert variant="secondary">Please, wait for the server's answer...</Alert>}
    <Form onSubmit={handleSubmit}>
      <Form.Group className='mb-3'>
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" minLength={2} required={true} value={title} onChange={(event) => setTitle(event.target.value)}></Form.Control>
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Publication Date</Form.Label>
        <Form.Control type="date" value={publicationDate} onChange={(event) => setpublicationDate(event.target.value)}></Form.Control>
      </Form.Group>
      {editablePage ? 
        <><Button variant="primary" type="submit">Update</Button> <Link to='../..' relative='path' className='btn btn-danger'>Cancel</Link></> :
        <><Button variant="primary" type="submit" disabled={waiting}>Add</Button> <Link to='..' relative='path' className='btn btn-danger'>Cancel</Link></>
      }
      <br/><br/>
    <Form.Group>
        <Form.Label className="my-3" as="legend">
          Select Type of block
        </Form.Label>
        <Col>
          <Form.Check
            inline
            className="my-3"
            type="radio"
            label="header"
            id="header"
            name="typeB"
            value="header"
            checked={typeB === "header"}
            onChange={ onTypeBlockChange}
          />
          <Form.Check
            inline
            className="my-3"
            type="radio"
            label="paragraph"
            id="paragraph"
            name="typeB"
            value="paragraph"
            checked={typeB === "paragraph"}
            onChange={onTypeBlockChange}
          />
           <Form.Check
            inline
            className="my-3"
            type="radio"
            label="image"
            id="image"
            name="typeB"
            value="image"
            checked={typeB === "image"}
            onChange={onTypeBlockChange}
          />
        </Col>
      </Form.Group>
      {typeB=='header'?<Form.Control size="lg" type="text" placeholder="header of page" value={content} onChange={(event) => setContent(event.target.value)}/>:<></>}
      {typeB=='paragraph'? <FloatingLabel controlId="floatingTextarea2" label="Paragraph">
        <Form.Control
          as="textarea"
          placeholder="Paragraph"
          style={{ height: '150px' }}
          value={content} onChange={(event) => setContent(event.target.value)}
        />
      </FloatingLabel>:<></>}
      {typeB=='image'?
      <Col md>
        <FloatingLabel
          controlId="floatingSelectGrid"
          label="choose an image"
        >
          <Form.Select aria-label="choose an image" value={content} onChange={(event) => setContent(event.target.value)}>
            <option>Open this select menu</option>
            <option value="Roma.jpg">Rome</option>
            <option value="Pizza.jpg">Pizza</option>
            <option value="flower.jpg" >flower</option>
          </Form.Select>
        </FloatingLabel>
      </Col>:<></>}

      <br/>
      <Button variant="primary" onClick={()=>handleSubmitBlock()}>Add</Button>
      {isShown && blocks.map((block)=><BlockOutput blockData={block} key={block.id_b}/>)}
      <br/><br/>
      </Form>
    </>

)
}
function BlockOutput(props){
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
export default PageForm;
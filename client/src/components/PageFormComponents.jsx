import { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { Form, Button, Alert,Col,Card, Table } from 'react-bootstrap';
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
    const now=dayjs().format('YYYY-MM-DD');
    const [isShown, setIsShown] = useState(editablePage?true:false);
    const [isWrong,setIsWrong]=useState(false);

    const [contHeader,setContHeader]=useState(false)
    const [contField,setContField]=useState(0)

    const [typeB,setTypeB]=useState('')
    const [editableBlock,setEditableBlock]=useState([]);



    const [waiting, setWaiting] = useState(false);
    const [id_p,setId]=useState(editablePage? editablePage.id_p: props.lastID )
    const [title,setTitle]=useState(editablePage?editablePage.title:'')
    const [author,setAuthor]=useState(props.user.name)
    const [creationDate,setCreationDate]=useState(editablePage?editablePage.creationDate:now)
    const [publicationDate,setpublicationDate]=useState(editablePage?editablePage.publicationDate:'');
    const [blocks,setBlock]=useState(editablePage?editablePage.blocks:[])
    const [newBlocks,setNewBlocks]=useState([]);
   
    const [id_b,setIdB]=useState(60);
    const [content,setContent]=useState('');
    
    const onTypeBlockChange=({target:{value}})=>{
      setTypeB(value);
    };
    
    const handleSubmit=async (event)=>{
        event.preventDefault(); 
       let r=0;
        
        if(editablePage) {
          //modify page
          //concateni i due blocchi e li passi, qui crei la pagina con i blocchi quindi sposti la creazione della pagina
          if(newBlocks.length>0 && editableBlock.length>0){
              setBlock((block)=>block.concat(editableBlock));
          }
          
          
          const page=new Page(id_p,title,author,creationDate,publicationDate,blocks);
          setWaiting(true);
          
          API.updatePage(page)
          .then(() => {
            setWaiting(false);
            navigate(`/`)})
          .catch() ;
          }
          else {
         // console.log(props.lastID)
        
          if(contField<2||contHeader==false){
            setIsWrong(true);
          }else{
          const page=new Page(id_p,title,author,creationDate,publicationDate,blocks);
          props.setPages(pre => [...pre,page])
          setWaiting(true);
              API.addPage(page)
               .then(()=>{
                setWaiting(false);
                navigate(`/`);
                });
          }
        }
      }

    const handleSubmitBlock=()=>{
      console.log(typeB)
      if(contHeader==false && typeB=='header')setContHeader(true)
      setContField(contField+1); 
      if(editablePage){
        setNewBlocks(pre => [...pre,{type:typeB,content:content,page_id:id_p}])
      }else{
        setBlock( pre => [...pre,{type:typeB,content:content,page_id:id_p}]);
        setIsShown(true);
      }
      
      
    }
   


    return(
    <>
    {waiting && <Alert variant="secondary">Please, wait for the server's answer...</Alert>}
    {isWrong&&<Alert variant="secondary">number of blocks are wrog...</Alert> }
    <Card>
      <Card.Body>{author}</Card.Body>
      <Card.Body>{creationDate}</Card.Body>
    </Card>
    <Form onSubmit={handleSubmit}>
      <Form.Group className='mb-3'>
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" minLength={2} required={true} value={title} onChange={(event) => setTitle(event.target.value)}></Form.Control>
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Publication Date</Form.Label>
        <Form.Control type="date" value={publicationDate} onChange={(event) => setpublicationDate(dayjs(event.target.value).format("YYYY-MM-DD"))}></Form.Control>
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
      <br/><br/><br/><br/>
      {isShown && 
      <Table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Content</th>
          <th>Sort</th>
          <th>Edit</th>
          <th>Delete</th>

        </tr>
      </thead>
      {blocks.map((block)=><BlockOutput blockData={block} key={block.id_b} id_p={id_p} setContent={setContent} setEditableBlock={setEditableBlock}/>)}
      </Table>}

      <br/><br/>
      </Form>
    </>

)
}

function BlockOutput(props){
  const content=props.blockData.content;
  const [changeContent,setChangeContent]=useState(content)
//vettore di blocchi modificati

  const handleChange=()=>{
    props.setContent(changeContent);
    props.setEditableBlock( pre => [...pre,{type:props.blockData.type,content:content,page_id: props.id_p}])
  }
 
    return(
      <>
      <tbody>
      <tr>
      <th>{props.blockData.type}</th>
    {props.blockData.type=='header'?<th> <Form.Control type="text" minLength={2} required={true} value={changeContent} onChange={(event) => setChangeContent(event.target.value)}></Form.Control></th>:<></>}
    {props.blockData.type=='image'? <th><Image src={`${content}/100px250`} fluid /></th>:<></>}
    {props.blockData.type=='paragraph'?
                                      <th>
                                      <Form.Control
                                        as="textarea"
                                        style={{ height: '150px' }}
                                        value={changeContent} onChange={(event) => setChangeContent(event.target.value)}/>
                                      </th>
                                  :<></>} 
      <th><Button variant="outline-dark"><i class="bi bi-arrow-down" ></i></Button>
      <Button variant="outline-dark" ><i class="bi bi-arrow-up"></i></Button></th>
      <th><Button variant="outline-dark" onClick={()=>handleChange()}><i class="bi bi-check2"></i></Button></th>
      <th><Button variant="outline-dark"><i class="bi bi-trash3-fill"></i></Button></th>
      </tr>
      </tbody>
    </>
    )
  }
export default PageForm;
import { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { Form, Button, Alert,Col,Card, Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import {Page,Block} from '../Page'
import API from '../API';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import FormCheck from 'react-bootstrap/FormCheck'

//import all images
import Rome from '../image/Rome.jpg'
import Pizza from '../image/Pizza.jpg'
import Game from '../image/Game.jpg'
import Dog from '../image/Dog.jpg'
import Garden from '../image/Garden.jpg'

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
    const [newBlocks,setNewBlocks]=useState([]);
    const [deleteBlocks,setDeleteBlocks]=useState([])


    const [waiting, setWaiting] = useState(false);
    const [id_p,setId]=useState(editablePage? editablePage.id_p: props.lastID )
    const [title,setTitle]=useState(editablePage?editablePage.title:'')
    const [author,setAuthor]=useState(props?.user?.role=='admin'&&editablePage ? editablePage.author : props?.user?.name)
    const [creationDate,setCreationDate]=useState(editablePage?editablePage.creationDate:now)
    const [publicationDate,setpublicationDate]=useState(editablePage?editablePage.publicationDate:'');
    const [blocks,setBlock]=useState(editablePage?editablePage.blocks:[])
    
   
    const [id_b,setIdB]=useState(60);
    const [content,setContent]=useState('');
    
    const onTypeBlockChange=({target:{value}})=>{
      setTypeB(value);
    };
    
    const handleSubmit=async (event)=>{
        event.preventDefault(); 
       let r=0;
        
        if(editablePage) {
         // setNewBlocks((nB)=>nB.filter(x=> !deleteBlocks.has(x)));
         // setEditableBlock((edB)=>edB.filter(x=>!deleteBlocks.has(x)));
          
          const page=new Page(id_p,title,author,creationDate,publicationDate,blocks,editableBlock,newBlocks,deleteBlocks);
         
          setWaiting(true);
          API.updatePage(page)
          .then(() => {
            setWaiting(false);
            navigate(`/`)})
          .catch() ;
          }
          else {
        
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
                })
                .catch();
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
    const handleDelete=()=>{
      API.deletePage(editablePage,id_p).
        then(()=>navigate(`/`))
        .catch();
    }
   


    return(
    <>
    {waiting && <Alert variant="secondary">Please, wait for the server's answer...</Alert>}
    {isWrong&&<Alert variant="secondary">number of blocks are wrog...</Alert> }
    {editablePage?<Table>
      <tr>
        <th><Button variant='danger' onClick={()=>handleDelete()} ><i class="bi bi-scissors" >Delete page</i></Button></th>
      </tr>
    </Table>:<></>}
    <Form onSubmit={handleSubmit}>
    <Card>
    {props.user.role=='admin'?
    <Form.Group className='mb-3'>
        <Form.Label>Author</Form.Label>
        <Form.Control type="text" minLength={2} required={true} value={author} onChange={(event) => setAuthor(event.target.value)}></Form.Control>
      </Form.Group>
    :
      <Card.Body>{author}</Card.Body>
      }
      <Card.Body>{creationDate}</Card.Body>
      </Card>
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
            <option value="Rome">Rome</option>
            <option value="Pizza">Pizza</option>
            <option value="Dog" >Dog</option>
            <option value="Game" >Game</option>
            <option value="Garden">Garden</option>

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
      {blocks.map((block)=><BlockOutput setDeleteBlocks={setDeleteBlocks} blockData={block} key={block.id_b}  id_p={id_p} setContent={setContent} setEditableBlock={setEditableBlock}/>)}
      {editablePage? newBlocks.map((block)=><BlockOutput setDeleteBlocks={setDeleteBlocks} key={block.id_b} blockData={block} id_p={id_p} setContent={setContent} setEditableBlock={setEditableBlock}/>) :<></>}
      </Table>
      }

      <br/><br/>
      </Form>
    </>

)
}

function BlockOutput(props){
  const content=props.blockData.content;
  const [image,setImage]=useState({"Rome":Rome,"Pizza":Pizza,"Dog":Dog,"Game":Game,"Garden":Garden})
  //props.setIdB(props.blockData.id)
  const [changeContent,setChangeContent]=useState(content)
  const [elDelete,setDelete]=useState(false)
  
//vettore di blocchi modificati

  const handleChange=()=>{
   // props.setContent(changeContent);
    props.setEditableBlock( pre => [...pre,{type:props.blockData.type,id_b:props.blockData.id_b,content:changeContent,page_id: props.id_p}])

  }

  const handleDelete=()=>{
    setDelete(true);
    props.setDeleteBlocks( pre => [...pre,{type:props.blockData.type,id_b:props.blockData.id_b, content:content,page_id: props.id_p}]);
  }
 
    return(
      <>
      {!elDelete?
      <tbody>
      <tr>
      <th>{props.blockData.type}</th>
    {props.blockData.type=='header'?<th> <Form.Control type="text" minLength={2} required={true} value={changeContent} onChange={(event) => setChangeContent(event.target.value)}></Form.Control></th>:<></>}
    {props.blockData.type=='image'? <th><Card.Img src={image[content]} fluid /></th>:<></>}
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
      <th><Button variant="outline-dark" onClick={()=>handleDelete()}><i class="bi bi-trash3-fill"></i></Button></th>
   
      </tr>
      </tbody>
      :<></>}
    </>
    )

  }
export default PageForm;
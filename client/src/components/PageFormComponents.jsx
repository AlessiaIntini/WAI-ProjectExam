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

    const [contHeader,setContHeader]=useState( editablePage? editablePage.blocks.filter(x => x.type=='header').length:0 )
    const [contField,setContField]=useState(editablePage? editablePage.blocks.filter(x => x.type!=='header').length:0 )

    const [typeB,setTypeB]=useState('')

    const [editableBlock,setEditableBlock]=useState([]);
    const [newBlocks,setNewBlocks]=useState([]);
    const [deleteBlocks,setDeleteBlocks]=useState([])


    const swap = (array, i, j) => [array[i], array[j]] = [array[j], array[i]];
    let orderArray=[];

    const [waiting, setWaiting] = useState(false);
    const [id_p,setId]=useState(editablePage? editablePage.id_p: props.lastID )
    const [title,setTitle]=useState(editablePage?editablePage.title:'')
    const [author,setAuthor]=useState(props?.user?.role=='admin'&&editablePage ? editablePage.author : props?.user?.name)
    const [creationDate,setCreationDate]=useState(editablePage?editablePage.creationDate:now)
    const [publicationDate,setpublicationDate]=useState(editablePage?editablePage.publicationDate:'');
    const [blocks,setBlock]=useState(editablePage?editablePage.blocks:[])

    const [pos,setPos]=useState(0)
    
   
    const [id_b,setIdB]=useState(60);
    const [content,setContent]=useState('');
    
    const onTypeBlockChange=({target:{value}})=>{
      setTypeB(value);
    };
    
const handleSubmit=async (event)=>{
  let h=0;
  let cf=0;
  if(props.loggedIn){
    event.preventDefault(); 
 
   

    console.log(contField)
    console.log(contHeader)

    for (const db of deleteBlocks){
      if(db.type=='header'){
        if(contHeader>0){
          setContHeader((h)=>h-1)
        }
      }else{
        if(contField>0){
          setContField((cf)=>cf-1)
        }
      }
    }
    if(contField===0||contHeader===0){
      setIsWrong(true);
    }else{
      if(editablePage) {
        orderArray=[...blocks];
        let i=0;
        for(const ob of orderArray){
          ob.pos=i;
          i++;
          }
        setBlock(orderArray)
          
        const page=new Page(id_p,title,author,creationDate,publicationDate,blocks,editableBlock,newBlocks,deleteBlocks);
         
        setWaiting(true);
        
        API.updatePage(page)
        .then(() => {
          setWaiting(false);
          navigate(`/`)})
        .catch() ;
      }else {
        let bNew=[]
        let find
        for(const row of blocks){
          find = 0
          for(const c of deleteBlocks){
            if(c.content===row.content && c.type===row.type){
              find = 1
            }
          }
        if(!find)
            bNew.push(row)
        }
        let i=0;
        for(const b of bNew){
          b.pos=i;
          i=i+1;
        }
      
        const page=new Page(id_p,title,author,creationDate,publicationDate,bNew);
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
  }else{
    navigate(`/`);
  }
  }

  const handleSubmitBlock=()=>{
  if(props.loggedIn){
  if(typeB=='header')setContHeader((h)=>h+1)
  else  setContField((cf)=>cf+1); 
      if(editablePage){
        setNewBlocks(pre => [...pre,{type:typeB,content:content,page_id:id_p}])
      }else{
        setBlock( pre => [...pre,{type:typeB,content:content,page_id:id_p,pos:pos}]);
        setIsShown(true);
        setPos((p)=>p+1);
      }
    }else{
      navigate(`/`);
    }
      
    }
    const handleDelete=()=>{
      if(props.loggedIn){
      API.deletePage(editablePage,id_p).
        then(()=>navigate(`/`))
        .catch();
    }else{
      navigate(`/`)
    }
  }

//dir=false verso giù indici i e i+1
//dir=true verso su inidici i e i-1
  const handleSwap=(block,dir)=>{
    orderArray=[...blocks]
    let index = orderArray.findIndex(item => item == block);
    if(!dir){
    swap(orderArray,index,index+1)
    }else{
    swap(orderArray,index,index-1)
    }
    setBlock(orderArray)
  }
   

    return(
    <>
    {waiting && <Alert variant="secondary">Please, wait for the server's answer...</Alert>}
    {isWrong&&<Alert variant="danger" onClose={() => setIsWrong(false)}>Number of blocks are wrog, add other blocks or return to home page</Alert> }
    {editablePage?<Table>
    <tbody>
      <tr>
        <th><Button variant='danger' onClick={()=>handleDelete()} ><i class="bi bi-scissors" >Delete page</i></Button></th>
      </tr>
    </tbody>
    </Table>:<></>}
    <Form onSubmit={handleSubmit}  noValidate>
    <Card>
    {props?.user?.role=='admin'?
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
        <Form.Control type="date" required={false}  value={publicationDate} onChange={(event) => setpublicationDate(editablePage && isNaN(publicationDate)? event.target.value: dayjs(event.target.value).format("YYYY-MM-DD"))}></Form.Control>
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
      <Button variant="primary" type="reset" onClick={()=>handleSubmitBlock()}>Add</Button>
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
      {blocks.map((block)=><BlockOutput handleSwap={handleSwap} setDeleteBlocks={setDeleteBlocks} editablePage={editablePage} blockData={block} key={block.pos}  id_p={id_p} setContent={setContent} setEditableBlock={setEditableBlock}/>)}
      {editablePage? newBlocks.map((block)=><BlockOutput setDeleteBlocks={setDeleteBlocks} key={block.pos} blockData={block} id_p={id_p} setContent={setContent} setEditableBlock={setEditableBlock}/>) :<></>}
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
    if(props.editablePage){
    props.setDeleteBlocks( pre => [...pre,{type:props.blockData.type,id_b:props.blockData.id_b, content:content,page_id: props.id_p}]);
    }else{
      props.setDeleteBlocks( pre => [...pre,{type:props.blockData.type, content:content,page_id: props.id_p}]);
    }
  }


 
    return(
      <>
      {!elDelete?
      <tbody>
      <tr>
      <th>{props.blockData.type}</th>
    {props.blockData.type=='header'?<th> <Form.Control type="text" minLength={2} required={true} value={changeContent} onChange={(event) => setChangeContent(event.target.value)}></Form.Control></th>:<></>}
    {props.blockData.type=='image'? <th><Card.Img src={image[content]}  />
    <Col md>
        <FloatingLabel
          controlId="floatingSelectGrid"
          label="choose an image"
        >
          <Form.Select aria-label="choose an image" value={changeContent} onChange={(event) => setChangeContent(event.target.value)}>
            <option>Open this select menu</option>
            <option value="Rome">Rome</option>
            <option value="Pizza">Pizza</option>
            <option value="Dog" >Dog</option>
            <option value="Game" >Game</option>
            <option value="Garden">Garden</option>

          </Form.Select>
        </FloatingLabel>
        </Col>
        </th>
    :<></>}
    {props.blockData.type=='paragraph'?
                                      <th>
                                      <Form.Control
                                        as="textarea"
                                        style={{ height: '150px' }}
                                        value={changeContent} onChange={(event) => setChangeContent(event.target.value)}/>
                                      </th>
                                  :<></>} 
      <th><Button variant="outline-dark"><i class="bi bi-arrow-down" onClick={()=>props.handleSwap(props.blockData,false) }></i></Button>
      <Button variant="outline-dark" ><i class="bi bi-arrow-up" onClick={()=>props.handleSwap(props.blockData,true) }></i></Button></th>
      <th><Button variant="outline-dark" onClick={()=>handleChange()}><i class="bi bi-check2"></i></Button></th>
      <th><Button variant="outline-dark" onClick={()=>handleDelete()}><i class="bi bi-trash3-fill"></i></Button></th>
   
      </tr>
      </tbody>
      :<></>}
    </>
    )

  }
export default PageForm;
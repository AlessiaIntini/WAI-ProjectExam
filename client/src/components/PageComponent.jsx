import 'dayjs';
import { Table, Form } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';

function PageTable(props){
 return(
  <div>
   <Card className="Bootstrap-Card">
      <Card.Header>All pages</Card.Header>
      <Card.Body className="d-flex flex-column justify-content-end align-items-center">
        <Card.Text>
        <Table striped>
        <tbody>
            {props.pages.map((page)=><PageRow pageData={page} key={page.id}/>)}
        </tbody>
        </Table>
        </Card.Text>
      </Card.Body>
    </Card>
  
    
  </div>
 );
}

function PageRow(props){
    const formatWatchDate = (dayJsDate, format) => {
        return dayJsDate ? dayJsDate.format(format) : '';
      }
      return(
        <tr>
            <td>
            <p>{props.pageData.title}</p>
            </td>
            <td>
            <p>{props.pageData.author}</p>
            </td>
            <td>
          <p>{props.pageData.creationDate}</p>
        </td>
        <td>
        <p>{props.pageData.publicationDate}</p>
        </td>
        </tr>
      );
}

export default PageTable
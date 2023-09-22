import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from "react-router-bootstrap";

const Tabs = () => {
  return (
    <Nav variant="pills" defaultActiveKey="/" className='justify-content-center my-4' style={{ width: '1296px', textAlign: 'center' }}>
      <LinkContainer className='text-warning' to="/">
        <Nav.Link><strong>Swap</strong></Nav.Link>
      </LinkContainer>
      <LinkContainer className='text-warning' to="/deposit">
        <Nav.Link><strong>Deposit</strong></Nav.Link>
      </LinkContainer>
      <LinkContainer className='text-warning' to="/withdraw">
        <Nav.Link><strong>Withdraw</strong></Nav.Link>
      </LinkContainer>
      <LinkContainer className='text-warning' to="/charts">
        <Nav.Link><strong>Charts</strong></Nav.Link>
      </LinkContainer>
    </Nav>
  );
}

export default Tabs;

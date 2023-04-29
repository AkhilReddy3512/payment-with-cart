import { useNavigate, useLocation } from 'react-router-dom';

const Failure = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const errorDescription = state.errorDescription;
    const orderId = state.orderId;
    const paymentId = state.paymentId;

    const styles = {
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        padding: '20px',
        borderRadius: '5px',
        maxWidth: '500px',
        margin: '0 auto'
    };
    
    const headingStyles = {
        color: '#721c24',
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom:"9px"
    };
    
    const paragraphStyles = {
        color: '#721c24',
        fontSize: '18px',
        marginBottom: '13px'
    };
    
    return (
        <div style={styles}>
            <h1 style={headingStyles}>Transaction Failed</h1>
            <p style={paragraphStyles}> {errorDescription}</p>
            <br />
            <p style={paragraphStyles}>Payment ID: {paymentId}</p>
            <p style={paragraphStyles}>Order ID: {orderId}</p>
            <button className="btn btn-outline-danger" onClick={() => {navigate('/')}}>Click here to Try Again!!</button>
            <p style={{marginTop:"3%"}}><i>Take Screenshot for further reference</i></p>
        </div>
    );
};

export default Failure;

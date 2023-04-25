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
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '5px'
    };
    
    return (
        <div style={styles}>
            <h1 style={{ color: 'red' }}>Transaction Failed</h1>
            <p> {errorDescription}</p>
            <p>Payment ID: {paymentId}</p>
            <p>Order ID: {orderId}</p>
            <button onClick={() => {navigate('/')}}>Click here to Try Again!!</button>
        </div>
    );
};

export default Failure;

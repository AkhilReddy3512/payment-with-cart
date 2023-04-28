import { Link, useLocation } from 'react-router-dom';

const Success = () => {
    const location = useLocation();
    const { paymentId, orderId } = location.state;

    const styles = {
        textAlign: 'center',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '5px'
    };
    return (
        <div style={styles}>
            <h1 style={{ color: 'green' }}>Transaction Success</h1>
            <h2>Thanks for purchasing the Product!</h2>
            <p>Payment ID: {paymentId}</p>
            <p>Order ID: {orderId}</p>
            <Link className="btn btn-secondary" to="https://otp-login-b8ec1.firebaseapp.com/" role="button" target='_blank'>Go Back to Home Page</Link>
        </div>
    );
};

export default Success;

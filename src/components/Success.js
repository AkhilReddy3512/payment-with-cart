import { Link, useLocation } from 'react-router-dom';

const Success = () => {
    const location = useLocation();
    const { paymentId, orderId } = location.state;

    const styles = {
        textAlign: 'center',
        backgroundColor: '#d4edda',
        padding: '20px',
        borderRadius: '5px',
        maxWidth: '500px',
        margin: '0 auto'
    };
    
    const headingStyles = {
        color: '#155724',
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '0'
    };
    const paragraphStyles = {
        color: '#155724',
        fontSize: '18px',
        marginTop:"5px",
        marginBottom: '10px'
    };

    return (
        <div style={styles}>
            <h1 style={headingStyles}> Transaction Success</h1>
            <h2 style={{marginTop:"5px", marginBottom:"5px"}}>Thanks for purchasing the Product!</h2>
            <p style={paragraphStyles}>Payment ID: {paymentId}</p>
            <p style={paragraphStyles}>  Order ID: {orderId}</p>
            <Link className="btn btn-success" to="https://otp-login-b8ec1.firebaseapp.com/" role="button" >Go Back to Home Page</Link>
            <p style={{marginTop:"3%"}}><i>Take Screenshot for further reference</i></p>
        </div>
    );
};

export default Success;

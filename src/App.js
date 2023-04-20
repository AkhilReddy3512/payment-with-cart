import React, { useState } from 'react';

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

function App() {
	const [products] = useState([
		{ id: 1, name: "Product 1", amount: 100 },
		{ id: 2, name: "Product 2", amount: 100 },
		{ id: 3, name: "Product 3", amount: 100 },
		{ id: 4, name: "Product 4", amount: 100 },
		{ id: 5, name: "Product 5", amount: 100 },
		{ id: 6, name: "Product 6", amount: 100 },
	]);

	const [cartItems, setCartItems] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const addToCart = (product) => {
		const existingItem = cartItems.find((item) => item.id === product.id);
		if (existingItem) {
			alert("Product already added to cart!");
			return;
		}
		setCartItems([...cartItems, product]);
		setTotalAmount(totalAmount + product.amount);
	};

	const removeCartItem = (product) => {
		const updatedCartItems = cartItems.filter((item) => item.id !== product.id);
		setCartItems(updatedCartItems);
		setTotalAmount(totalAmount - product.amount);
	};

	async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}
		//const data = await fetch('http://localhost:1337/razorpay', { method: 'POST' },{body: {amount : 500}, }).then((t) =>t.json())
		//console.log(data)
		const data = await fetch(`http://localhost:1337/razorpay`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ amount: totalAmount }),
		}).then((t) => t.json());
		console.log(data);
		const options = {
			key: 'rzp_test_A2p665XWi2QO4u',
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'Reality AI',
			description: 'Thank you for nothing. Please give us some money',
			image: 'https://www.arm.com/-/media/global/Why%20Arm/partner/Partner%20Ecosystem/ai-catalog/reality-ai/reality-ai-logo.png?rev=03b4e9975e1540cf8141d72d011981f0&revision=03b4e997-5e15-40cf-8141-d72d011981f0',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)

			},
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}
	return (
		// <div className="App">	
		// 		<button onClick={displayRazorpay}>Click to pay ₹499</button>
		// </div>
		<div className='container-main'>
			<h2>My Package</h2>
			{cartItems.length === 0 ? (
				<p>No items in your package, Check our products</p>
			) : (
				<ul>
					{cartItems.map((item) => (
						<li key={item.id}>
							{item.name} - ₹ {item.amount}
							<button onClick={() => removeCartItem(item)}>Remove</button>
						</li>
					))}
				</ul>
			)}
			{totalAmount > 0 &&
				<div>
					<p>Total amount: ₹ {totalAmount}</p>
					<button onClick={displayRazorpay}>Proceed to Payment</button>
					<hr />
				</div>
}
			<h2>Available Products</h2>
			<ul>
				{products.map((product) => (
					<li key={product.id}>
						{product.name} - ₹ {product.amount}
						<button onClick={() => addToCart(product)}>Add to Package</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default App
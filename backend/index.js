const app = require('express')()
const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())

const razorpay = new Razorpay({
	key_id: 'rzp_test_A2p665XWi2QO4u',
	key_secret: 'Iwp4D2SXeCLbCYsQyozAKH4z'
})


app.post('/razorpay', async (req, res) => {
	console.log(req.body.amount)
	const payment_capture = 1
	const amount = req.body.amount
	const currency = 'INR'
	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})

app.post('/verification', (req, res) => {
	// do a validation

	const secret = 'Iwp4D2SXeCLbCYsQyozAKH4z'
	console.log(req.body)
	const crypto = require('crypto')
	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')
	console.log(digest, req.headers['x-razorpay-signature'])
	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it

		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})

app.listen(1337, () => {
	console.log('Listening on 1337')
})
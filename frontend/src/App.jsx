import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { api } from '../config/backend'

function App() {
	const [file, setFile] = useState(null)
	const [preview, setPreview] = useState(null)
	const [status, setStatus] = useState("idle")
	const [seen, setSeen] = useState(false)
	const [hidden, setHidden] = useState(true)
	const [message, setMessage] = useState({})

	const convertToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file); // This generates the 'data:image/...' string your backend needs
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
			setPreview(URL.createObjectURL(selectedFile)); // Create local preview
			setStatus("idle");
		}
	};

	const handleUpload = async () => {
		if (!file) return
		setStatus("uploading")

		// Convert to Base64 first
		const base64String = await convertToBase64(file)

		// Send JSON payload
		try {
			// Keep your existing logic to strip the extension
			const response = await axios.post(`${api}/Image/upload`, {
				filename: file.name.split('.').slice(0, -1).join('.'),
				image: base64String
			})

			// If code reaches here, the status was 2xx (Success)
			setStatus("success")
		} catch (error) {
			// Axios throws an error for 4xx/5xx responses
			setStatus("error")
			console.error("Server error:", error)
		}
	}

	const fetchMessage = async () => {
		const { data, status } = await axios.get(`${api}/Message/active`)

		setMessage(data.message)
	}

	useEffect(() => {
		fetchMessage()
	}, [])

	return (
		<div className="_2mld">
			<div className='bigot-who'>
				<div>
					<p>Please select a file</p>
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						style={{ marginBottom: '10px' }}
					/>

					{preview && (
						<div style={{ marginBottom: '10px' }}>
							<img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
						</div>
					)}

					<button
						onClick={handleUpload}
						disabled={!file || status === "uploading"}
						style={{ padding: '8px 16px', cursor: 'pointer' }}
					>
						{status === "uploading" ? "Uploading..." : "Upload to Server"}
					</button>

					{status === "success" && <p style={{ color: 'green' }}>✅ File uploaded successfully!</p>}
					{status === "error" && <p style={{ color: 'red' }}>❌ Upload failed.</p>}
				</div>
				<div className='erases-lube'>
					<div>
						{message.unix && message.unix.map((stamps) => {
							const date = new Date(stamps.timestamp)

							const formatted =
								date.toLocaleDateString('en-GB', {
									day: '2-digit',
									month: 'short',
									year: 'numeric'
								}) +
								', ' +
								date.toLocaleTimeString('en-US', {
									hour: '2-digit',
									minute: '2-digit'
								})

							return (
								<div style={{ paddingBottom: "10px" }}>
									<div style={{ color: "green", fontWeight: "500" }}>{formatted}</div>
									<div>{stamps.ip}</div>
									<div style={{ fontSize: "14px", color: "grey" }}>{stamps.ua}</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
			<div className='easer-fork'>
				<div style={{ display: "flex", justifyContent: "flex-end", padding: "5px 30px" }}>
					<p style={{ cursor: "pointer", color: "purple", textDecoration: "underline", margin: "0px" }}>History</p>
				</div>
				<div className='nugget-bay'>
					<div className='squired-quad'>
						{hidden ? (
							<div className='hidden'>
								<div style={{ width: "50px", height: "50px" }}></div>
							</div>
						) : <div className='thesis-bios'>
							<img src={`${api}/Image/1-note`} alt='' />
							{[...Array(6)].map((_, index) => <img src={`${api}/Image/${index + 2}`} alt='' />)}
						</div>}
						<div className='landline-held' onClick={() => setHidden((prev) => !prev)}></div>
					</div>
					<div className='inured-wow' style={{ backgroundColor: message.seen ? "rgb(84, 144, 94)" : "rgb(255, 90, 90)" }}>{message.seen ? "seen" : "unseen"}</div>
				</div>
			</div>
		</div>
	)
}

export default App

# Imagify: AI Image Generator

## Project Overview
AImagiNation is a web-based application that transforms text descriptions into AI-generated images using cutting-edge image generation technologies.


## Features
- Text-to-image generation
- Responsive web design
- User-friendly interface
- Advanced AI image creation

## Technologies Used
- Frontend: React.js
- Styling: Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- AI Integration: [CLIPDROP](https://clipdrop.com/)

## Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB
- AI Image Generation API credentials

## Installation

### Clone the Repository
```bash
git clone https://github.com/[joeyzazalin]/Ai-imagify.git
cd Ai-imagify
```

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Environment Configuration
Create `.env` files in both backend and frontend directories:

Backend `.env`:
```
MONGODB_URI=your_mongodb_connection_string
AI_API_KEY=your_ai_api_key
PORT=5000
```

Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5173
```

## Running the Application

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd frontend
npm start
```

## Usage
1. Enter a text description in the input field
2. Click "Generate Image"
3. View AI-generated image

## API Endpoints
- `POST /api/generate`: Generate image from text
- `GET /api/images`: Retrieve generated images
- `DELETE /api/images/:id`: Delete specific image

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Limitations
- Limited by AI API rate limits
- Image generation time varies
- Potential content moderation restrictions

## Future Roadmap
- Multiple AI model support
- User image galleries
- Advanced customization options

## Related Projects
- [DALL-E](https://openai.com/dall-e-2/)
- [Stable Diffusion](https://stability.ai/blog/stable-diffusion-public-release)

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
[Joseph Anateyi] - [josephanteyi@gmail.com]

Project Link: [https://github.com/[joeyzazalin]/Ai-imagify](https://github.com/[joeyzazalin]/Ai-imagify)
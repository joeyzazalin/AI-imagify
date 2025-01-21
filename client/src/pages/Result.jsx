import { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'

const Result = () => {
  const [generatedImage, setGeneratedImage] = useState(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')

  const { generateImage } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    
    try {
      setLoading(true)
      const image = await generateImage(input)
      
      if (image) {
        setGeneratedImage(image)
        setIsImageLoaded(true)
      }
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAnother = () => {
    setIsImageLoaded(false)
    setGeneratedImage(null)
    setInput('')
  }

  return (
    <motion.form 
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler} 
      className='flex flex-col min-h-[90vh] justify-center items-center'
    >
      <div className='relative'>
        <div>
          {/* Show generated image if available, otherwise show sample image */}
          <img 
            src={generatedImage || assets.sample_img_1} 
            alt={generatedImage ? 'Generated Image' : 'Sample Image'}
            className='max-w-sm rounded'
            onError={(e) => {
              console.error('Image loading error')
              e.target.src = assets.sample_img_1 // Fallback to sample image on error
            }}
          />
          <span 
            className={`absolute bottom-0 left-0 h-1 bg-blue-500 
              ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`}
          />
        </div>
        {loading && <p className="mt-2 text-center">Generating your image...</p>}
      </div>

      {!isImageLoaded && (
        <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type='text'
            placeholder='Describe what you want to generate'
            className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20'
            disabled={loading}
          />
          <button 
            type='submit'
            disabled={loading || !input.trim()}
            className={`px-10 sm:px-16 py-3 rounded-full ${
              loading || !input.trim() 
                ? 'bg-zinc-600 cursor-not-allowed' 
                : 'bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      )}

      {isImageLoaded && (
        <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
          <button
            type='button'
            onClick={handleGenerateAnother}
            className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer hover:bg-zinc-100'
          >
            Generate Another
          </button>
          <a 
            href={generatedImage}
            download="generated-image.png"
            className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer hover:bg-zinc-800'
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  )
}

export default Result
import React from 'react'
import { assets } from '../assets/assets'
import {motion} from 'framer-motion'

const Description = () => {
  return (
    <motion.div 
    initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    className='flex flex-col items-center justify-center my-24 p-6 md:px-28'>
        <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>create AI Images</h1>
        <p className='text-gray-500 mb-8'>Turn your imagination into visuals</p>

        <div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center'>
            <img src={assets.sample_img_1} alt='' className='rounded-lg w-80 xl:w-96' />
            <div>
                <h2 className='text-3xl font-medium max-w-lg mb-4'>Introducing the AI-powered text to Image Generator</h2>
                <p className='text-gray-600 mb-4'>Easily bring your ideas to life with our free AI image generator. whether you need stunning visuals or unique imagery, our tool transforms your text into eye-catching images with just a few clicks. Imagine it, describe it, and watch it come to life instantly.</p>
                <p className='text-gray-600'>Our AI image generator is perfect for content creators, marketers, and anyone who wants to create stunning visuals without the need for design skills. Simply describe your idea, and our tool will generate a unique image that you can use for your projects.</p>
            </div>
        </div>
    </motion.div>
  )
}


export default Description
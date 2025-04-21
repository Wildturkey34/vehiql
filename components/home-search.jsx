"use client";

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Camera, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useFetch from '@/hooks/use-fetch';
import { processImageSearch } from '@/actions/home';

const HomeSearch = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

    // Use the useFetch hook for image processing
    const {
      loading: isProcessing,
      fn: processImageFn,
      data: processResult,
      error: processError,
    } = useFetch(processImageSearch);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if(!searchTerm.trim()){
      toast.error("Please enter a search term")
      return;
    }
    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`);
  };
  const handleImageSearch = async(e) => {
    e.preventDefault();
    if(!searchImage){
      toast.error("Please upload an image first");
      return;
    }

    await processImageFn(searchImage);
  };

  useEffect(() =>{
    if(processResult?.success){
      const params = new URLSearchParams();

       // Add extracted params to the search
       if (processResult.data.make) params.set("make", processResult.data.make);
       if (processResult.data.bodyType)
         params.set("bodyType", processResult.data.bodyType);
       if (processResult.data.color)
         params.set("color", processResult.data.color);
 
       // Redirect to search results
       router.push(`/cars?${params.toString()}`);
    }
  },[processResult])


  useEffect(() => {
    if (processError) {
      toast.error(
        "Failed to analyze image: " + (processError.message || "Unknown error")
      );
    }
  }, [processError]);

  const onDrop = (acceptedFiles) => {
    // Do something with the files
    const file = acceptedFiles[0];

    if(file){
      if(file.size > 5 * 1024 * 1024){
        toast.error("Image size must be less than 5MB");
        return;
      }
      setIsUploading(true);
      setSearchImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("Image uploaded successfully");
      };

      reader.onerror = () => {  
        setIsUploading(false);
        toast.error("Failed to read the  image");
      };

      reader.readAsDataURL(file);
    }
  }
  const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({
    onDrop,
    accept:{
      "image/*":['.jpeg', '.jpg' , '.png'],
    },
    maxFiles: 1,
  })

  return (
    <div>
      <form onSubmit={handleTextSubmit}>
        <div className='relative flex items-center'>
          <Input type="text" placeholder="Enter make, model, or use our AI image search..."
          value ={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-12 py-6 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm"
          />
          <div className='absolute right-[100px]'>
            <Camera  
            size={35}
            onClick={() => setIsImageSearchActive(!isImageSearchActive)}
            className='cursor-pointer rounded-xl p-1.5'
            style={{
              backgroound: isImageSearchActive ? 'black' : '',
              color: isImageSearchActive ? 'white' : '',
            }}
            />
          </div>
          <Button type="submit" className="absolute right-2 rounded-full">
            Search
          </Button>
        </div>
      </form>
          {isImageSearchActive && <div className='mt-4'>
            <form onSubmit={handleImageSearch}>
              <div className='border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center'>
              {imagePreview? (
                <div className='flex flex-col items-center'>
                <img src={imagePreview} 
                alt="car preview" 
                className='h-40 object-contain mb-4'
                />
                <Button type='button' 
                variant='destructive' 
                onClick={() => {
                  setImagePreview(null);
                  setImagePreview("");
                  toast.info("Image removed successfully")
                  }}
                  >
                  Remove Image
                </Button>
                </div>
              ):(
                <div {...getRootProps()} className='cursor-pointer'>
                <input {...getInputProps()} />
                <div className='flex flex-col items-center'>

                <Upload className='h-12 w-12 text-gray-400 mb-2'/>
                <p className='text-gray-500 mb-2'>
                {isDragActive && !isDragReject?
                  "Leave the file here to upload" 
                  : "Drag and drop your image here, or click to select a file"
                }
                </p>
                {isDragReject && (
                  <p className='text-red-500 mb-2'>Invalid Image type</p>
                )}
                <p className='text-gray-400 text-sm'>
                  supports: JPG, PNG (max 5MB)
                </p>
                </div>
              </div>
              )}
              </div>

              {imagePreview && (
                <Button type="submit" className="w-full mt-2" disabled={isUploading || isProcessing}>
                   {isUploading?"Uploading...":isProcessing?"Analyzing Image...":"Search with this Image"}
                </Button>
              )}

            </form>
          </div>
            
            }
    </div>
  )
}

export default HomeSearch
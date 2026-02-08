import { useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';

const ImageCropper = ({imgUrl, save, setCroppedAreaPixels}: {imgUrl: string, save: () => void, setCroppedAreaPixels: (area: Area) => void}) => {
  const [ crop, setCrop ] = useState<Point>({ x: 0, y: 0 });
  const [ zoom, setZoom ] = useState<number>(1);

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  return (
    <div className='h-full absolute top-0 left-0 w-full flex flex-col gap-5 justify-center items-center z-10 backdrop-blur-sm'>
      <Cropper 
        classes={{containerClassName: 'h-full w-full', cropAreaClassName: 'rounded-full'}}
        image={imgUrl}
        crop={crop}
        zoom={zoom}
        aspect={1}
        cropShape='round'
        showGrid={false}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />

      <button type='button' onClick={save} title='save' className='bg-blueC text-wA h-12 w-26 absolute bottom-10 rounded-xl text-md md:text-xl font-semibold grid items-center'>
        Save
      </button>
    </div>
  )
}

export default ImageCropper;
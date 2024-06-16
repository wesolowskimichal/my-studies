import { useEffect, useRef, useState } from 'react'

type useCanvasProps = {
  image: File | null
}

export const useCanvas = ({ image = null }: useCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [radius, setRadius] = useState(0)
  const [radiusPercentage, setRadiusPercentage] = useState(1.0)
  const [maxRadius, setMaxRadius] = useState(0)
  const [bufferedImage, setBufferedImage] = useState<HTMLImageElement | null>(null)
  const [ratio, setRatio] = useState(1)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [pictureX, setPictureX] = useState(0)
  const [pictureY, setPictureY] = useState(0)

  const cropImage = (): string | null => {
    if (bufferedImage && context) {
      // const sx = x / ratio
      // const sy = y / ratio
      const sx = (y - radius) / ratio
      // const sx = (x - radius) / ratio
      const sy = (y - radius) / ratio
      console.log(sx)
      console.log(sy)

      const size = (radius * 2) / ratio

      const croppedImage = document.createElement('canvas')
      croppedImage.width = size
      croppedImage.height = size

      const croppedContext = croppedImage.getContext('2d')
      if (croppedContext) {
        croppedContext.drawImage(bufferedImage, sx, sy, size, size, 0, 0, size, size)
      }

      const croppedImageUrl = croppedImage.toDataURL()
      console.log(croppedImageUrl)

      return croppedImageUrl
    }

    return null
  }

  const drawCircle = (x: number, y: number, radius: number, strokeWidth: number, color: string) => {
    if (context) {
      context.beginPath()
      context.arc(x, y, radius, 0, 2 * Math.PI)
      context.lineWidth = strokeWidth
      context.strokeStyle = color
      context.stroke()
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        setContext(ctx)
      }
    }
    document.addEventListener('mousedown', changePosition)
    return () => window.removeEventListener('mousemove', changePosition)
  }, [])

  const reposition = (event: MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const scaleX = canvasRef.current.width / rect.width
      const scaleY = canvasRef.current.height / rect.height
      const x = (event.clientX - rect.left) * scaleX
      const y = (event.clientY - rect.top) * scaleY
      if (x > rect.left && x < rect.right && y > rect.bottom && y < rect.top) {
        setX(x)
        setY(y)
      }
    }
  }

  const changePosition = (event: MouseEvent) => {
    reposition(event)
  }

  useEffect(() => {
    if (image) {
      const imageUrl = URL.createObjectURL(image)
      const img = new Image()
      img.onload = () => {
        const cWidth = canvasRef.current!.width
        const cHeight = canvasRef.current!.height

        var hRatio = cWidth / img.width
        var vRatio = cHeight / img.height
        var ratio = Math.min(hRatio, vRatio)

        const centerShift_x = cWidth / 2
        const centerShift_y = cHeight / 2

        setMaxRadius((Math.min(img.width, img.height) * ratio) / 2)
        setX(centerShift_x)
        setY(centerShift_y)
        setPictureX(centerShift_x)
        setPictureY(centerShift_y)
        setRadius((Math.min(img.width, img.height) * ratio) / 2)
        URL.revokeObjectURL(imageUrl)
      }
      img.src = imageUrl
      setBufferedImage(img)
    }
  }, [image])

  useEffect(() => {
    if (bufferedImage && context) {
      context.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
      const cWidth = canvasRef.current!.width
      const cHeight = canvasRef.current!.height
      var hRatio = cWidth / bufferedImage.width
      var vRatio = cHeight / bufferedImage.height
      const rect = canvasRef.current?.getBoundingClientRect()
      var ratio = Math.min(hRatio, vRatio)
      const centerShift_x = (cWidth - bufferedImage.width * ratio) / 2
      const centerShift_y = (cHeight - bufferedImage.height * ratio) / 2
      context.drawImage(
        bufferedImage,
        0,
        0,
        bufferedImage.width,
        bufferedImage.height,
        centerShift_x,
        centerShift_y,
        bufferedImage.width * ratio,
        bufferedImage.height * ratio
      )
      let dx = x
      if (dx < rect!.left - radius / 2) dx = rect!.left - radius / 2
      else if (dx > rect!.left + bufferedImage.width * hRatio * ratio) dx = rect!.left + bufferedImage.width * hRatio
      drawCircle(dx!, y, radius, 1, 'red')
      setRatio(ratio)
    }
  }, [bufferedImage, context, radius, x, y])

  const addRadius = (percentage: number) => {
    let newRadiusPercentage = radiusPercentage + percentage
    if (newRadiusPercentage <= 0) newRadiusPercentage = 0.05
    else if (newRadiusPercentage > 1) newRadiusPercentage = 1
    setRadiusPercentage(newRadiusPercentage)
    setRadius(maxRadius * newRadiusPercentage)
  }

  const handleSetRadius = (percentage: number) => {
    if (percentage <= 0) percentage = 0.05
    else if (percentage > 1) percentage = 1
    setRadiusPercentage(percentage)
    setRadius(maxRadius * percentage)
  }

  const getRadiusPercentage = (): number => {
    return radiusPercentage * 100
  }

  return {
    canvas: <canvas ref={canvasRef} style={{ flexBasis: '80%' }} />,
    addRadius: addRadius,
    setRadius: handleSetRadius,
    radiusPercentage: getRadiusPercentage(),
    cropImage
  }
}

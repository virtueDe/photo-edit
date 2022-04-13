type src = string
interface PhotoEditOptions {
  src: src
}

class PhotoEdit {
  private container
  private canvasDom: HTMLCanvasElement = document.createElement("canvas")
  private canvasCtx: CanvasRenderingContext2D = this.canvasDom.getContext("2d") as CanvasRenderingContext2D
  // options: PhotoEditOptions = {
  //   src,
  // }
  constructor(container: HTMLElement, options: PhotoEditOptions) {
    this.container = container
    this.initCanvas()
    this.setImage(options.src)
    // Object.assign(this, _options, options)
  }
  initCanvas() {
    this.canvasDom.width = this.container.offsetWidth
    this.canvasDom.height = this.container.offsetHeight
    this.container.appendChild(this.canvasDom)
  }
  setImage(src: src) {
    const img = document.createElement("img")
    img.src = src

    img.onload = () => {
      const scale =
        Math.min(this.canvasDom.width / img.width, this.canvasDom.height / img.height) >= 3
          ? 3
          : Math.min(this.canvasDom.width / img.width, this.canvasDom.height / img.height)

      const offset = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }
      offset.width = img.width * scale
      offset.height = img.height * scale

      offset.x = (this.canvasDom.width - offset.width) / 2
      offset.y = (this.canvasDom.height - offset.height) / 2

      this.canvasCtx.drawImage(img, offset.x, offset.y, offset.width, offset.height)
    }
  }
}

export { PhotoEdit }

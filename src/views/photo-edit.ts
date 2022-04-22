type src = string
interface PhotoEditOptions {
  src: src
}

class PhotoEdit {
  private container
  private containerCanvas: HTMLCanvasElement = document.createElement("canvas")
  private containerCanvasCtx: CanvasRenderingContext2D = this.containerCanvas.getContext("2d") as CanvasRenderingContext2D

  private imageCanvas: HTMLCanvasElement = document.createElement("canvas")
  private imageCanvasCtx: CanvasRenderingContext2D = this.imageCanvas.getContext("2d") as CanvasRenderingContext2D

  private position = {
    imageCanvasPosition: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  }

  eventStatus = {
    isDown: false,
    hasPosition: false,
  }
  criticalValue: {
    x: number[]
    y: number[]
  } = {
    x: [],
    y: [],
  }

  startPoint = {
    x: 0,
    y: 0,
  }

  // options: PhotoEditOptions = {
  //   src,
  // }
  constructor(container: HTMLElement, options: PhotoEditOptions) {
    this.container = container
    this.initCanvas()
    this.setImage(options.src)
    this._initEvent()
    // Object.assign(this, _options, options)
  }
  initCanvas() {
    this.containerCanvas.width = this.container.getBoundingClientRect().width
    this.containerCanvas.height = this.container.getBoundingClientRect().height
    this.container.appendChild(this.containerCanvas)
  }
  setImage(src: src) {
    const img = document.createElement("img")
    img.src = src

    img.onload = () => {
      const scale =
        Math.min(this.containerCanvas.width / img.width, this.containerCanvas.height / img.height) >= 3
          ? 3
          : Math.min(this.containerCanvas.width / img.width, this.containerCanvas.height / img.height)

      this.position.imageCanvasPosition.width = img.width * scale
      this.position.imageCanvasPosition.height = img.height * scale

      this.position.imageCanvasPosition.x = (this.containerCanvas.width - this.position.imageCanvasPosition.width) / 2
      this.position.imageCanvasPosition.y = (this.containerCanvas.height - this.position.imageCanvasPosition.height) / 2
      this.imageCanvas.width = this.position.imageCanvasPosition.width
      this.imageCanvas.height = this.position.imageCanvasPosition.height
      this.imageCanvasCtx.drawImage(img, 0, 0, this.position.imageCanvasPosition.width, this.position.imageCanvasPosition.height)

      this.criticalValue.x[0] = 150
      this.criticalValue.y[0] = 150

      this.criticalValue.x[1] = this.containerCanvas.width - this.position.imageCanvasPosition.width - 150
      this.criticalValue.y[1] = this.containerCanvas.height - this.position.imageCanvasPosition.height - 150

      this._draw()
    }
  }
  _initEvent() {
    this.container.addEventListener("mousedown", this._onMousedown.bind(this))
    this.container.addEventListener("mousemove", this._onMousemove.bind(this))
    this.container.addEventListener("mouseup", this._onMouseup.bind(this))
    this.container.addEventListener("mouseleave", () => {
      this.eventStatus.hasPosition = false
      this.eventStatus.isDown = false
      this.container.removeEventListener("mousemove", this._onMousemove.bind(this))
    })
    // document.addEventListener("mousemove", (e: MouseEvent) => {
    //   if (!this._hasPosition({ x: e.clientX, y: e.clientY })) {
    //     this.eventStatus.hasPosition = false
    //     this.eventStatus.isDown = false
    //     this.container.removeEventListener("mousemove", this._onMousemove.bind(this))
    //   }
    // })
  }
  _onMousedown(e: MouseEvent) {
    this.eventStatus.isDown = true

    if (this._hasPosition({ x: e.clientX, y: e.clientY })) {
      this.startPoint.x = e.clientX - this.position.imageCanvasPosition.x
      this.startPoint.y = e.clientY - this.position.imageCanvasPosition.y
      this.eventStatus.hasPosition = true
    }
  }
  _onMouseup(e: MouseEvent) {
    this.eventStatus.isDown = false
    this.eventStatus.hasPosition = false
  }
  _onMousemove(e: MouseEvent) {
    e.preventDefault()
    if (this.eventStatus.isDown && this.eventStatus.hasPosition) {
      const moveX = e.clientX - this.startPoint.x
      const moveY = e.clientY - this.startPoint.y

      // if (moveX <= this.criticalValue.x[0]) moveX = this.criticalValue.x[0]
      // if (moveY <= 0) moveY = 0
      // if (moveX > this.containerCanvas.width - this.position.imageCanvasPosition.width) {
      //   moveX = this.containerCanvas.width - this.position.imageCanvasPosition.width
      // }
      // if (moveY > this.containerCanvas.height - this.position.imageCanvasPosition.height) {
      //   moveY = this.containerCanvas.height - this.position.imageCanvasPosition.height
      // }

      // console.log(moveX)

      // console.log(this.position.imageCanvasPosition.x - moveX)
      if (moveX <= this.criticalValue.x[0]) {
        //   // console.log(moveX)
        //   console.log(this.position.imageCanvasPosition.x - moveX)
        //   // moveX = this.criticalValue.x[0]
        //   // moveX *= 60 / (60 + moveX)
        // moveX = Math.floor((this.position.imageCanvasPosition.x - moveX) * 0.25)
        // console.log(moveX)
        // moveX += this.containerCanvas.width - this.position.imageCanvasPosition.width
        // moveX = (moveX * 150) / (150 - moveX) - this.containerCanvas.width + this.position.imageCanvasPosition.width
      }

      this.position.imageCanvasPosition.x = moveX
      this.position.imageCanvasPosition.y = moveY

      window.requestAnimationFrame(this._draw.bind(this))
    }
  }
  _hasPosition({ x, y }: { x: number; y: number }): boolean {
    let isMouseInDrawer = false
    const _x = this.position.imageCanvasPosition.x + this.position.imageCanvasPosition.width
    const _y = this.position.imageCanvasPosition.y + this.position.imageCanvasPosition.height

    if (x < this.position.imageCanvasPosition.x || x > _x || y < this.position.imageCanvasPosition.y || y > _y) {
      isMouseInDrawer = false
    } else {
      isMouseInDrawer = true
    }
    return isMouseInDrawer
  }
  // _hasPosition({ x, y, name }: { x: number; y: number; name?: string }): {
  //   x: number
  //   y: number
  //   width: number
  //   height: number
  // } {
  //   if
  //   // console.log(x, y, name)
  //   // const po = name && this.position[name]
  //   return {
  //     x: 0,
  //     y: 0,
  //     width: 0,
  //     height: 0,
  //   }
  // }
  _draw() {
    this.containerCanvasCtx.clearRect(0, 0, this.containerCanvas.width, this.containerCanvas.height)
    this.containerCanvasCtx.drawImage(
      this.imageCanvas,
      this.position.imageCanvasPosition.x,
      this.position.imageCanvasPosition.y,
      this.position.imageCanvasPosition.width,
      this.position.imageCanvasPosition.height
    )
  }
}

export { PhotoEdit }

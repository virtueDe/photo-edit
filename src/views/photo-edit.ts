type src = string
interface PhotoEditOptions {
  src: src
}

// 临界点 Threshold

class PhotoEdit {
  private sourceImg: HTMLImageElement = document.createElement("img")
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
      rotate: 0,
      scale: 0,
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

  pointerCurrent = {
    x: 0,
    y: 0,
  }

  pointerLast = {
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
  toCanvasPio(x: number, y: number) {
    const { x: _x, y: _y } = this.container.getBoundingClientRect()
    return {
      x: x - _x,
      y: y - _y,
    }
  }
  initCanvas() {
    this.containerCanvas.width = this.container.getBoundingClientRect().width
    this.containerCanvas.height = this.container.getBoundingClientRect().height
    this.container.appendChild(this.containerCanvas)
  }
  setImage(src: src) {
    this.sourceImg.src = src

    this.sourceImg.onload = () => {
      this.position.imageCanvasPosition.scale =
        Math.min(this.containerCanvas.width / this.sourceImg.width, this.containerCanvas.height / this.sourceImg.height) >= 3
          ? 3
          : Math.min(this.containerCanvas.width / this.sourceImg.width, this.containerCanvas.height / this.sourceImg.height)

      this.position.imageCanvasPosition.width = this.sourceImg.width * this.position.imageCanvasPosition.scale
      this.position.imageCanvasPosition.height = this.sourceImg.height * this.position.imageCanvasPosition.scale

      this.position.imageCanvasPosition.x = (this.containerCanvas.width - this.position.imageCanvasPosition.width) / 2
      this.position.imageCanvasPosition.y = (this.containerCanvas.height - this.position.imageCanvasPosition.height) / 2
      this.imageCanvas.width = this.position.imageCanvasPosition.width
      this.imageCanvas.height = this.position.imageCanvasPosition.height
      this.imageCanvasCtx.drawImage(this.sourceImg, 0, 0, this.position.imageCanvasPosition.width, this.position.imageCanvasPosition.height)

      // this.criticalValue.x[0] = 200
      // this.criticalValue.y[0] = 200

      // this.criticalValue.x[1] = this.containerCanvas.width - this.position.imageCanvasPosition.width - 200
      // this.criticalValue.y[1] = this.containerCanvas.height - this.position.imageCanvasPosition.height - 200

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
    this.container.addEventListener("wheel", this._onWheel.bind(this))

    document.addEventListener("mousemove", this._onWindowMove.bind(this))

    //   if (!this._hasPosition({ x: e.clientX, y: e.clientY })) {
    //     this.eventStatus.hasPosition = false
    //     this.eventStatus.isDown = false
    //     this.container.removeEventListener("mousemove", this._onMousemove.bind(this))
    //   }
    // })
  }

  _onWindowMove(e: MouseEvent) {
    if (this._hasPosition({ x: e.clientX, y: e.clientY })) {
      this.container.style.cursor = "move"
    } else {
      this.container.style.cursor = "default"
    }
  }
  _onWheel(e: WheelEvent) {
    if (this._hasPosition({ x: e.clientX, y: e.clientY })) {
      e.preventDefault()
      let { scale } = this.position.imageCanvasPosition
      // const delta = ev.deltaY
      e.deltaY < 0 ? (scale += 0.05) : (scale -= 0.05)

      if (scale + 0.05 > 3) {
        scale = 3
      } else if (scale - 0.05 < 0.1) {
        scale = 0.1
      }
      const PO = {
        x: this.position.imageCanvasPosition.width / 2 + this.position.imageCanvasPosition.x,
        y: this.position.imageCanvasPosition.height / 2 + this.position.imageCanvasPosition.y,
      }

      this.imageCanvasCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height)

      this.imageCanvas.width = this.position.imageCanvasPosition.width =
        (this.position.imageCanvasPosition.width / this.position.imageCanvasPosition.scale) * scale
      this.imageCanvas.height = this.position.imageCanvasPosition.height =
        (this.position.imageCanvasPosition.height / this.position.imageCanvasPosition.scale) * scale
      this.imageCanvasCtx.drawImage(this.sourceImg, 0, 0, this.imageCanvas.width, this.imageCanvas.height)

      this.position.imageCanvasPosition.x = PO.x - this.position.imageCanvasPosition.width / 2
      this.position.imageCanvasPosition.y = PO.y - this.position.imageCanvasPosition.height / 2

      this.position.imageCanvasPosition.scale = scale
      this._draw()
    }
  }
  _onMousedown(e: MouseEvent) {
    this.eventStatus.isDown = true

    if (this._hasPosition({ x: e.clientX, y: e.clientY })) {
      // this.startPoint.x = e.clientX - this.position.imageCanvasPosition.x
      // this.startPoint.y = e.clientY - this.position.imageCanvasPosition.y
      this.eventStatus.hasPosition = true
      this.pointerLast = this.pointerCurrent = {
        x: e.clientX,
        y: e.clientY,
      }

      // this.pointerLastX = pointerCurrentX = event.x
      // pointerLastY = pointerCurrentY = event.y
    }
  }
  _onMouseup(e: MouseEvent) {
    this.eventStatus.isDown = false
    this.eventStatus.hasPosition = false
  }
  _onMousemove(e: MouseEvent) {
    e.preventDefault()
    if (this.eventStatus.isDown && this.eventStatus.hasPosition) {
      this.pointerCurrent = {
        x: e.clientX,
        y: e.clientY,
      }
      const pointerChangeX = this.pointerCurrent.x - this.pointerLast.x
      const pointerChangeY = this.pointerCurrent.y - this.pointerLast.y

      this.position.imageCanvasPosition.x += pointerChangeX
      this.position.imageCanvasPosition.y += pointerChangeY
      window.requestAnimationFrame(this._draw.bind(this))
    }
  }
  _hasPosition({ x, y }: { x: number; y: number }): boolean {
    let isMouseInDrawer = false

    const { x: canvasX, y: canvasY } = this.toCanvasPio(x, y)

    const _x = this.position.imageCanvasPosition.x + this.position.imageCanvasPosition.width
    const _y = this.position.imageCanvasPosition.y + this.position.imageCanvasPosition.height

    if (canvasX < this.position.imageCanvasPosition.x || canvasX > _x || canvasY < this.position.imageCanvasPosition.y || canvasY > _y) {
      isMouseInDrawer = false
    } else {
      isMouseInDrawer = true
    }
    return isMouseInDrawer
  }
  _draw() {
    // let diffX = 0
    // let diffY = 0
    // if (this.position.imageCanvasPosition.x < this.criticalValue.x[0]) {
    //   diffX = this.criticalValue.x[0] - this.position.imageCanvasPosition.x
    // } else if (this.position.imageCanvasPosition.x > this.criticalValue.x[1]) {
    //   diffX = this.criticalValue.x[1] - this.position.imageCanvasPosition.x
    // }
    // if (diffX !== 0) {
    //   this.position.imageCanvasPosition.x -= pointerChangeX * (0.000005 * Math.pow(diffX, 2) + 0.0001 * diffX + 0.55)
    // }

    // if (this.position.imageCanvasPosition.y < this.criticalValue.y[0]) {
    //   diffY = this.criticalValue.y[0] - this.position.imageCanvasPosition.y
    // } else if (this.position.imageCanvasPosition.y > this.criticalValue.y[1]) {
    //   diffY = this.criticalValue.y[1] - this.position.imageCanvasPosition.y
    // }
    // if (diffY !== 0) {
    //   this.position.imageCanvasPosition.y -= pointerChangeY * (0.000005 * Math.pow(diffY, 2) + 0.0001 * diffY + 0.55)
    // }

    this.containerCanvasCtx.clearRect(0, 0, this.containerCanvas.width, this.containerCanvas.height)
    this.containerCanvasCtx.drawImage(
      this.imageCanvas,
      this.position.imageCanvasPosition.x,
      this.position.imageCanvasPosition.y,
      this.position.imageCanvasPosition.width,
      this.position.imageCanvasPosition.height
    )

    this.pointerLast = {
      x: this.pointerCurrent.x,
      y: this.pointerCurrent.y,
    }
  }
}

export { PhotoEdit }

import { getCursorStyle, getDashPosition, getDotPosition, getMousePosi } from "./utils"

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

  handleStatus = {
    isDown: false,
    hasPosition: false,
    isCrop: false,
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

  cropPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }

  downPo = {
    x: 0,
    y: 0,
  }

  mousePosi: number[][] = []

  cursorIndex = 9
  tempCursorIndex: number | null = null

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
  toContainerCanvasPio(x: number, y: number) {
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
        Math.min((this.containerCanvas.width - 200) / this.sourceImg.width, (this.containerCanvas.height - 200) / this.sourceImg.height) >= 3
          ? 3
          : Math.min((this.containerCanvas.width - 200) / this.sourceImg.width, (this.containerCanvas.height - 200) / this.sourceImg.height)

      this.position.imageCanvasPosition.width = this.sourceImg.width * this.position.imageCanvasPosition.scale
      this.position.imageCanvasPosition.height = this.sourceImg.height * this.position.imageCanvasPosition.scale

      this.position.imageCanvasPosition.x = (this.containerCanvas.width - this.position.imageCanvasPosition.width) / 2
      this.position.imageCanvasPosition.y = (this.containerCanvas.height - this.position.imageCanvasPosition.height) / 2
      this.imageCanvas.width = this.position.imageCanvasPosition.width
      this.imageCanvas.height = this.position.imageCanvasPosition.height
      this.imageCanvasCtx.drawImage(this.sourceImg, 0, 0, this.position.imageCanvasPosition.width, this.position.imageCanvasPosition.height)

      this.cropPosition.x = this.position.imageCanvasPosition.x
      this.cropPosition.y = this.position.imageCanvasPosition.y
      this.cropPosition.width = this.position.imageCanvasPosition.width
      this.cropPosition.height = this.position.imageCanvasPosition.height
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
      this.handleStatus.hasPosition = false
      this.handleStatus.isDown = false
      this.container.removeEventListener("mousemove", this._onMousemove.bind(this))
    })
    this.container.addEventListener("wheel", this._onWheel.bind(this))

    document.addEventListener("mousemove", this._onWindowMove.bind(this))

    //   if (!this._hasPosition({ x: e.clientX, y: e.clientY })) {
    //     this.handleStatus.hasPosition = false
    //     this.handleStatus.isDown = false
    //     this.container.removeEventListener("mousemove", this._onMousemove.bind(this))
    //   }
    // })
  }

  _onWindowMove(e: MouseEvent) {
    // if (this._hasPosition({ x: e.clientX, y: e.clientY })) {
    //   this.container.style.cursor = "move"
    // } else {
    //   this.container.style.cursor = "default"
    // }
  }

  /**
   * 判断x,y是否在select路径上
   * @param pathX
   * @param pathY
   */
  checkInPath(pathX: number, pathY: number, rectPosi: number[]): boolean {
    this.containerCanvasCtx.beginPath()

    this.containerCanvasCtx.rect(...(rectPosi as [number, number, number, number]))

    // this.containerCanvasCtx.fill()
    const result = this.containerCanvasCtx.isPointInPath(pathX, pathY)
    // result && console.log(result)
    this.containerCanvasCtx.closePath()
    return result
  }

  _onWheel(e: WheelEvent) {
    // if (this._hasPosition({ x: e.clientX, y: e.clientY })) {
    //   e.preventDefault()
    //   let { scale } = this.position.imageCanvasPosition
    //   // const delta = ev.deltaY
    //   e.deltaY < 0 ? (scale += 0.05) : (scale -= 0.05)
    //   if (scale + 0.05 > 3) {
    //     scale = 3
    //   } else if (scale - 0.05 < 0.1) {
    //     scale = 0.1
    //   }
    //   const PO = {
    //     x: this.position.imageCanvasPosition.width / 2 + this.position.imageCanvasPosition.x,
    //     y: this.position.imageCanvasPosition.height / 2 + this.position.imageCanvasPosition.y,
    //   }
    //   this.imageCanvasCtx.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height)
    //   this.imageCanvas.width = this.position.imageCanvasPosition.width =
    //     (this.position.imageCanvasPosition.width / this.position.imageCanvasPosition.scale) * scale
    //   this.imageCanvas.height = this.position.imageCanvasPosition.height =
    //     (this.position.imageCanvasPosition.height / this.position.imageCanvasPosition.scale) * scale
    //   this.imageCanvasCtx.drawImage(this.sourceImg, 0, 0, this.imageCanvas.width, this.imageCanvas.height)
    //   this.position.imageCanvasPosition.x = PO.x - this.position.imageCanvasPosition.width / 2
    //   this.position.imageCanvasPosition.y = PO.y - this.position.imageCanvasPosition.height / 2
    //   this.position.imageCanvasPosition.scale = scale
    //   this._draw()
    // }
  }
  _onMousedown(e: MouseEvent) {
    this.handleStatus.isDown = true
    const { x, y } = this.toContainerCanvasPio(e.clientX, e.clientY)
    this.downPo = {
      x,
      y,
    }
    // if (this._hasPosition({ x: e.clientX, y: e.clientY })) {
    //   // this.startPoint.x = e.clientX - this.position.imageCanvasPosition.x
    //   // this.startPoint.y = e.clientY - this.position.imageCanvasPosition.y
    //   this.handleStatus.hasPosition = true
    // this.pointerCurrent = {
    //   x: e.clientX,
    //   y: e.clientY,
    // }
    //   // this.pointerLastX = pointerCurrentX = event.x
    //   // pointerLastY = pointerCurrentY = event.y
    // }
  }
  _onMouseup(e: MouseEvent) {
    // this.handleStatus.isCrop = false
    this.handleStatus.isDown = false
    this.tempCursorIndex = null
    // this.handleStatus.hasPosition = false
  }
  _onMousemove(e: MouseEvent) {
    e.preventDefault()
    if (this.handleStatus.isCrop) {
      let cursor = "default"
      this.cursorIndex = 9
      // cursorIndex = 9
      const { x: clientX, y: clientY } = this.toContainerCanvasPio(e.clientX, e.clientY)
      for (let i = 0; i < this.mousePosi.length; i++) {
        if (this.checkInPath(clientX, clientY, this.mousePosi[i])) {
          cursor = getCursorStyle(i)
          this.cursorIndex = i
          break
        }
      }
      this.container.style.cursor = cursor

      if (this.handleStatus.isDown) {
        const differenceX = clientX - this.downPo.x
        const differenceY = clientY - this.downPo.y
        const tempIndex = this.tempCursorIndex === null ? this.cursorIndex : this.tempCursorIndex
        console.log(tempIndex)
        switch (tempIndex) {
          // 左上角
          case 0:
            this.cropPosition.x += differenceX
            this.cropPosition.y += differenceY
            this.cropPosition.width -= differenceX
            this.cropPosition.height -= differenceY
            break

          // 右上角
          case 1:
            this.cropPosition.y += differenceY
            this.cropPosition.width += differenceX
            this.cropPosition.height -= differenceY
            break

          // 右下角
          case 2:
            this.cropPosition.width += differenceX
            this.cropPosition.height += differenceY
            break

          // 左下角
          case 3:
            this.cropPosition.x += differenceX
            this.cropPosition.width -= differenceX
            this.cropPosition.height += differenceY
            break

          // 上
          case 4:
            this.cropPosition.y += differenceY
            this.cropPosition.height -= differenceY
            break

          // 右
          case 5:
            this.cropPosition.width += differenceX
            break

          // 下
          case 6:
            this.cropPosition.height += differenceY
            break

          // 左
          case 7:
            this.cropPosition.x += differenceX
            this.cropPosition.width -= differenceX
            break

          // 整体
          case 8:
            this.cropPosition.x += differenceX
            this.cropPosition.y += differenceY
            break
          default:
            break
        }

        // this.cropPosition.width += clientX - this.downPo.x
        // this.cropPosition.height += clientY - this.downPo.y

        this.crop()

        this.downPo = {
          x: clientX,
          y: clientY,
        }
        // this.pointerCurrent = {
        //   x: e.clientX,
        //   y: e.clientY,
        // }
        // const pointerChangeX = this.pointerCurrent.x - this.pointerLast.x
        // const pointerChangeY = this.pointerCurrent.y - this.pointerLast.y
        // console.log(pointerChangeX, pointerChangeY)
        // this.cropPosition.width += pointerChangeX
        // this.crop()
        // console.log(this.pointerLast)

        if (this.tempCursorIndex === null) {
          this.tempCursorIndex = this.cursorIndex
        }
      }
    }
    // if (this.handleStatus.isDown && this.handleStatus.hasPosition) {
    //   this.pointerCurrent = {
    //     x: e.clientX,
    //     y: e.clientY,
    //   }
    //   const pointerChangeX = this.pointerCurrent.x - this.pointerLast.x
    //   const pointerChangeY = this.pointerCurrent.y - this.pointerLast.y

    //   this.position.imageCanvasPosition.x += pointerChangeX
    //   this.position.imageCanvasPosition.y += pointerChangeY
    //   window.requestAnimationFrame(this._draw.bind(this))
    // }
  }
  _hasPosition({ x, y }: { x: number; y: number }): boolean {
    let isMouseInDrawer = false

    const { x: canvasX, y: canvasY } = this.toContainerCanvasPio(x, y)

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
  crop() {
    this.handleStatus.isCrop = true
    this.containerCanvasCtx.clearRect(0, 0, this.containerCanvas.width, this.containerCanvas.height)
    this.drawCover()

    const { x, y, width, height } = this.cropPosition

    this.containerCanvasCtx.save()

    this.containerCanvasCtx.clearRect(x, y, width, height)

    this.containerCanvasCtx.lineWidth = 8
    this.containerCanvasCtx.strokeStyle = "#5696f8"
    this.containerCanvasCtx.strokeRect(x, y, width, height)

    this.containerCanvasCtx.fillStyle = "#5696f8"
    const dots = getDotPosition(x, y, width, height, 20)

    dots.map((v) => this.containerCanvasCtx.fillRect(...(v as Parameters<CanvasRenderingContext2D["fillRect"]>)))

    this.containerCanvasCtx.lineWidth = 1
    this.containerCanvasCtx.strokeStyle = "rgba(255, 255, 255, .75)"
    const dashs = getDashPosition(x, y, width, height)
    dashs.map((v) => {
      this.containerCanvasCtx.beginPath()
      this.containerCanvasCtx.setLineDash([2, 4])
      this.containerCanvasCtx.moveTo(v[0], v[1])
      this.containerCanvasCtx.lineTo(v[2], v[3])
      this.containerCanvasCtx.closePath()
      this.containerCanvasCtx.stroke()
      return null
    })
    this.containerCanvasCtx.restore()

    // this._draw()
    this.containerCanvasCtx.save()
    this.containerCanvasCtx.globalCompositeOperation = "destination-over"
    this.containerCanvasCtx.drawImage(
      this.imageCanvas,
      this.position.imageCanvasPosition.x,
      this.position.imageCanvasPosition.y,
      this.position.imageCanvasPosition.width,
      this.position.imageCanvasPosition.height
    )
    this.containerCanvasCtx.restore()

    this.mousePosi = getMousePosi(x, y, width, height)
    this.mousePosi.push([x, y, width, height])

    // this.pointerLast = {
    //   x,
    //   y,
    // }
  }
  /**
   * 画蒙层
   */
  drawCover() {
    this.containerCanvasCtx.save()
    this.containerCanvasCtx.fillStyle = "rgba(0,0,0,0.5)"
    this.containerCanvasCtx.fillRect(0, 0, this.containerCanvas.width, this.containerCanvas.height)
    this.containerCanvasCtx.globalCompositeOperation = "source-atop"
    this.containerCanvasCtx.restore()
  }
}

export { PhotoEdit }

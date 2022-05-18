// 选中框 及 裁剪框

type CropOptions = {
  // 边框的大小及颜色
  borderWidth: number
  borderColor: string

  // 上下左右及四个角的样式
  dotsSize: number
  dotsColor: string

  // 虚线样式
  dashedWidth: number
  dashedColor: string
}

// 裁剪框 || 自由缩放的选中框 || 固定缩放的选中框
type CropMode = "crop" | "free" | "fixed"

export default class Crop {
  cropMode: CropMode = "crop"

  // 蒙层、边框、虚线、四周的点、对角的点、旋转角标
  allModule = ["Mask", "Border", "Dashed", "AroundDots", "DiagonalDots", "Rotate"]

  cropModeData = {
    crop: [],
    free: [],
    fixed: [],
  }

  x = 0
  y = 0
  w = 0
  h = 0

  _canvasCtx: CanvasRenderingContext2D

  options: CropOptions = {
    borderWidth: 10,
    borderColor: "#5696f8",
    dotsSize: 20,
    dotsColor: "#5696f8",
    dashedWidth: 1,
    dashedColor: "rgba(255, 255, 255, .75)",
  }

  constructor(canvasCtx: CanvasRenderingContext2D, options: CropOptions) {
    this._canvasCtx = canvasCtx
    this.options = options
  }

  render(x: number, y: number, w: number, h: number): void {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  setCropMode(mode: CropMode) {
    this.cropMode = mode
  }

  // 画蒙层
  _drawMask() {
    const { w, h } = this
    this._canvasCtx.save()
    this._canvasCtx.fillStyle = "rgba(0,0,0,0.5)"
    this._canvasCtx.fillRect(0, 0, w, h)
    this._canvasCtx.globalCompositeOperation = "source-atop"
    this._canvasCtx.restore()
  }

  // 画边框
  _drawBorder() {
    const { x, y, w, h } = this
    this._canvasCtx.lineWidth = 8
    this._canvasCtx.strokeStyle = "#5696f8"
    this._canvasCtx.strokeRect(x, y, w, h)
  }

  // 画上下左右及四个角
  _drawDots() {
    this._canvasCtx.fillStyle = "#5696f8"
    // const dots = getDotPosition(x, y, width, height, 20)

    // dots.map((v) => this.containerCanvasCtx.fillRect(...(v as Parameters<CanvasRenderingContext2D["fillRect"]>)))
  }

  // _getDotPoi() {}
}

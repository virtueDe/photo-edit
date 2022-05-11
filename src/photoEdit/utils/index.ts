/**
 * 获取选中框的8个点
 * @param x
 * @param y
 * @param w
 * @param h
 */
export const getDotPosition = (x: number, y: number, w: number, h: number, size: number) => {
  return [
    // 上
    [x + w / 2 - size / 2, y - size / 2, size, size],
    // 下
    [x + w / 2 - size / 2, y + h - size / 2, size, size],
    // 左
    [x - size / 2, y + h / 2 - size / 2, size, size],
    // 右
    [x + w - size / 2, y + h / 2 - size / 2, size, size],
    // 左上角
    [x - size / 2, y - size / 2, size, size],
    // 右上角
    [x + w - size / 2, y - size / 2, size, size],
    // 左下角
    [x - size / 2, y + h - size / 2, size, size],
    // 右下角
    [x + w - size / 2, y + h - size / 2, size, size],
  ]
}

/**
 * 获取选中框的虚线
 * @param x
 * @param y
 * @param w
 * @param h
 */
export const getDashPosition = (x: number, y: number, w: number, h: number) => {
  return [
    [x, y + h / 3, x + w, y + h / 3],
    [x, y + (2 * h) / 3, x + w, y + (2 * h) / 3],
    [x + w / 3, y, x + w / 3, y + h],
    [x + (2 * w) / 3, y, x + (2 * w) / 3, y + h],
  ]
}

export const getMousePosi = (x: number, y: number, w: number, h: number) => {
  return [
    // 左上 右上 右下 左下 四个点
    [x - 10, y - 10, 20, 20],
    [x + w - 10, y - 10, 20, 20],
    [x + w - 10, y + h - 10, 20, 20],
    [x - 10, y + h - 10, 20, 20],
    // // 上 右 下 左 四条边
    [x - 4, y - 4, w + 4, 8],
    [x + w - 4, y - 4, 8, h + 4],
    [x - 4, y + h - 4, w + 4, 8],
    [x - 4, y - 4, 8, h + 4],
  ]
}

export const getCursorStyle = (i: number) => {
  let cursor = "default"
  switch (i) {
    case 0:
    case 2:
      cursor = "nwse-resize"
      break
    case 1:
    case 3:
      cursor = "nesw-resize"
      break
    case 4:
    case 6:
      cursor = "ns-resize"
      break
    case 5:
    case 7:
      cursor = "ew-resize"
      break
    case 8:
      cursor = "move"
      break
    default:
      break
  }
  return cursor
}

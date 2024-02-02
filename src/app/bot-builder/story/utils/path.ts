const _moveTo = (x: number, y: number) => {
  return `M${x} ${y}`;
};

const _lineTo = (x: number, y: number) => {
  return `L${x} ${y}`;
};

const _curveTo = (
  cp1x: number,
  cp1y: number,
  cp2x: number,
  cp2y: number,
  endX: number,
  endY: number,
) => {
  return `C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endX} ${endY}`;
};

const pathFromPoints = (startX: number, startY: number, endX: number, endY: number) => {
  return _moveTo(startX, startY) + _lineTo(endX, endY);
};

const generatePath = (mode: number, startX: number, startY: number, endX: number, endY: number) => {
  if (mode >= 7) {
    return (function (x1, y1, x2, y2) {
      const deltaX = y2 - y1;
      const deltaY = x2 - x1;

      if (deltaX === 0) {
        return _moveTo(x1, y1) + _lineTo(x2, y2);
      }

      const middleY = 0.5 * deltaY;

      if (Math.abs(deltaX) <= 10) {
        return pathFromPoints(x1 + middleY, y2, x2, y2);
      }

      const offset = 1 * (deltaY - middleY);
      return (
        _moveTo(x1, y1) +
        _lineTo(x1 + middleY, y1) +
        _lineTo(x1 + middleY, y2 + (deltaX > 0 ? -offset : offset)) +
        _curveTo(x1 + 0.5 * deltaY, y2, x1 + 0.5 * deltaY, y2, x1 + middleY + offset, y2) +
        _lineTo(x2, y2)
      );
    })(startX, startY, endX, endY);
  }

  return (function (x1, y1, x2, y2) {
    const deltaY = y2 - y1;
    return Math.abs(deltaY) <= 10
      ? pathFromPoints(x1, y1, x2, y2)
      : _moveTo(x1, y1) + _curveTo((x1 + x2) / 2, y1, (x1 + x2) / 2, y2, x2, y2);
  })(startX, startY, endX, endY);
};

export default generatePath;

export enum ImageDragMode {
  WATERMARK = "WATERMARK",
  BRUSH = "BRUSH",
  BRUSH_REMOVE = "BRUSH_REMOVE",
}
export function allDesc(): ImageDragMode[] {
  const ret: ImageDragMode[] = [];
  Object.values(ImageDragMode).forEach(x => {
    ret.push(x);
  });
  return ret;
}

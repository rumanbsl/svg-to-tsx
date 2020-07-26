import path from 'path';
import svgo from './svgo';

export default async function minifySvg(file, content) {
  const svg = await svgo.optimize(content);
  return {
    name: path.basename(file, '.svg'),
    svg
  }
}

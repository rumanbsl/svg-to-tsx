function _camelCase(string) {
  return string.replace(
    /^.|-./g,
    (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.substr(1).toUpperCase()
  );
}

function _basicCleanup(svg) {
  return svg
    .replace(/width="\S+"/, '')
    .replace(/height="\S+"/, '')
    .replace(/xmlns="(\S*)"/, '')
    .replace(/data-name="(.*?)"/, '')
    .replace(/([\w-]+)="/g, match => _camelCase(match))
    .replace(/\s{2,}/g, ' ')
    .replace(/xlink\:href="(\S*)"/g, 'xlinkHref="$1"')
    .replace(/xmlns\:xlink="(\S*)"/g, 'xmlnsXlink="$1"')
    .replace(/<style>(.*?)<\/style>/g, '');
}

export function cleanupName(name) {
  return name.replace(/u[A-Z0-9]{4}-/, '');
}

export function cleanupSvg(svg, keepFillColor, extractedWidth = "", extractedHeight = "") {
  const height = extractedHeight ? `typeof height === "number" ? height : (${extractedHeight})` : `typeof height === "number" ? height : size || 0`;
  const width = extractedWidth ? `typeof width === "number" ? width : (${extractedWidth})` : `typeof width === "number" ? width : size || 0`;
  const svgLink: string = _basicCleanup(svg);
  const hasViewBox = svgLink.indexOf("viewbox") !== -1;
  const replacedString = `{...rest} height={${height}} width={${width}} onClick={onClick} style={style} className={className}`;
  const cleanedSvg = hasViewBox ? svgLink
    .replace(/viewBox/, `${replacedString} viewBox`) : svgLink.replace("<svg", `<svg ${replacedString} viewbox="0 0 0 ${extractedHeight} ${extractedWidth}"`);

  return keepFillColor
    ? cleanedSvg
    : cleanedSvg
      .replace(/fill="#?\w+"/g, '')
      .replace(/viewBox/, 'fill={color} viewBox')
      .replace(/\s{2,}/g, ' ')
      .replace(/ \>/g, '>');
}

export function cleanupNativeSvg(svg, keepFillColor) {
  const cleanedSvg = _basicCleanup(svg)
    .replace(/viewBox/, '{...rest} height={height || size} width={width || size} style={style} viewBox')
    .replace(/\<[a-z]|\<\/[a-z]/g, match => match.toUpperCase());

  return keepFillColor
    ? cleanedSvg
    : cleanedSvg
      .replace(/fill="#?\w+"/g, '')
      .replace(/\<Path/g, '<Path fill={color}')
      .replace(/\s{2,}/g, ' ')
      .replace(/ \>/g, '>');
}

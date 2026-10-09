// Static stand-in for the design tool's <image-slot>: renders the image stored for a slot id
// (src/data/slots.json, with its crop: s = scale, x/y = offset in %) or falls back to `src`.
import React from 'react';
import slots from '../data/slots.json';
import paths from '../data/paths.json';

const resolve = (src) => {
  if (!src) return '';
  if (/^(https?:)?\/\//.test(src) || src.startsWith('/')) return src;
  return paths[src] || '/' + src;
};

export default function Slot({ id, src, fit = 'cover', placeholder = '', shape, style, ...rest }) {
  const slot = id ? slots[id] : null;
  const url = slot ? slot.src : resolve(src);
  const { s = 1, x = 0, y = 0 } = slot || {};
  const cropped = s !== 1 || Math.abs(x) > 0.01 || Math.abs(y) > 0.01;
  const isHint = /^\[.*\]$/.test(placeholder);
  const alt = isHint ? '' : placeholder.replace(/\s*\(or add[^)]*\)/, '');
  // Logos are inverted and screen-blended; blending against the page canvas is unreliable,
  // so give them an explicit page-coloured backdrop to blend with.
  if (rest['data-logo'] && style) {
    const { filter, mixBlendMode, background, ...box } = style;
    return (
      <div {...rest} data-slot={id} style={{ ...box, background: '#0C0D0F', isolation: 'isolate' }}>
        <img src={url} alt={alt} loading="lazy" decoding="async" draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: fit, filter, mixBlendMode }} />
      </div>
    );
  }
  return (
    <div {...rest} data-slot={id} style={{ overflow: 'hidden', background: '#16181B', ...style }}>
      {url ? (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block',
            objectFit: fit,
            transform: cropped ? `translate(${x}%, ${y}%) scale(${s})` : undefined,
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, textAlign: 'center', fontSize: 13, color: '#5B5F66' }}>
          {placeholder}
        </div>
      )}
    </div>
  );
}

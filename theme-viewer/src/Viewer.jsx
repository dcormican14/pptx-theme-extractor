import React, { useEffect, useState } from 'react';

// Helper to prettify color tag names
const prettifyTag = (tag) => {
  if (tag.startsWith('dk')) return 'Dark ' + tag.slice(2);
  if (tag.startsWith('lt')) return 'Light ' + tag.slice(2);
  if (tag.startsWith('accent')) return 'Accent ' + tag.slice(6);
  if (tag === 'hlink') return 'Hyperlink';
  if (tag === 'folHlink') return 'Visited Link';
  return tag.charAt(0).toUpperCase() + tag.slice(1);
};

const ThemeCard = ({ theme, tag, color, title }) => {
  // Fallbacks for chit appearance
  const bg = theme.lt2 || "#fff";
  const fg = theme.dk2 || "#222";
  const link = theme.hlink || "#0078d4";
  const visited = theme.folHlink || "#800080";
  const accent1 = theme.accent1 || "#224E7F";
  const accent2 = theme.accent2 || "#385E88";

  // Use the color for the chit border and label
  return (
    <div style={{
        width: 224,
        height: 169,
        background: 'lightgray',
        alignContent: 'center',
        display: 'flex',
        position: 'relative',
        margin: '0 auto'
    }}>
        <div style={{
            height: 128,
            width: "100%",
            background: bg,
            position: 'relative',
        }}>
            <div
                style={{
                    width: 176,
                    height: 96,
                    background: fg,
                    borderRadius: 12,
                    display: 'flex',
                    margin:'16px',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                }}
            >
                {/* Title label */}
                <div
                style={{
                    color: color,
                    fontWeight: 700,
                    fontSize: 22,
                    marginBottom: 4,
                    marginLeft: 8,
                    fontFamily: 'Segoe UI, Arial, sans-serif',
                    textAlign: 'left',
                }}
                >
                {title || 'Title'}
                </div>
                {/* Example text */}
                <div
                style={{
                    color: accent1,
                    fontSize: 15,
                    marginBottom: 2,
                    marginLeft: 8,
                    fontWeight: 500,
                    textAlign: 'center',
                }}
                >
                Example text
                </div>
                {/* Example links */}
                <div style={{ fontSize: 13 }}>
                <a
                    href="#"
                    style={{
                    color: link,
                    textDecoration: 'underline',
                    marginRight: 10,
                    marginLeft: 8,
                    }}
                    tabIndex={-1}
                >
                    Link
                </a>
                <a
                    href="#"
                    style={{
                    color: visited,
                    textDecoration: 'underline',
                    }}
                    tabIndex={-1}
                >
                    Visited
                </a>
                </div>
            </div>
            {/* Color tag label */}
            <div
                style={{
                position: 'absolute',
                top: 10,
                left: 16,
                background: color,
                color: '#fff',
                borderRadius: 6,
                padding: '2px 10px',
                fontSize: 13,
                fontWeight: 600,
                boxShadow: '0 1px 2px #0002',
                letterSpacing: 0.5,
                }}
            >
                {prettifyTag(tag)}
            </div>
        </div>
    </div>
  );
};

function Viewer() {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/chits.json')
      .then(res => res.json())
      .then(setThemes)
      .catch(err => console.error(err));
  }, []);

  // Group chits by file for filename display
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {themes.map(({ file, theme, title }) => (
        <div key={file} style={{ marginBottom: 32 }}>
          <div style={{
            fontWeight: 700,
            fontSize: 18,
            marginBottom: 12,
            marginLeft: 4,
            color: '#333'
          }}>
            {file}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              justifyItems: 'center'
            }}
          >
            {Object.entries(theme).map(([tag, color]) => (
              <ThemeCard
                key={`${file}-${tag}`}
                theme={theme}
                tag={tag}
                color={color}
                title={title}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Viewer;
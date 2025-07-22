import React, { useState } from 'react';
import './TemplateBuilder.css';

// Types for elements
const ELEMENT_TYPES = {
  MAIN_HEADER: '_main-header',
  HEADER_IMAGE: '_header-image',
  SECTION: '_section',
  MAIN_BODY_COPY: '_main-body-copy',
  BODY_IMAGE: '_body-image',
  YOUTUBE_VIDEO: '_youtube-video',
  ACCORDION: '_accordion',
  WIDGET_BLOCK: '_widget-block',
};

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const TemplateBuilder = () => {
  const [elements, setElements] = useState<any[]>([]);
  const [inputs, setInputs] = useState({
    mainHeader: '',
    headerImage: '',
    sectionTitle: '',
    mainBodyCopy: '',
    bodyImage: '',
    bodyCopyTitle: '',
    bodyCopy: '',
    youtubeUrl: '',
    accordionTitle: '',
    accordionCopy: '',
    widgetField: '',
  });
  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [openAccordions, setOpenAccordions] = useState<{ [id: string]: boolean }>({});

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const addElement = (type: string) => {
    let data = {};
    if (type === ELEMENT_TYPES.MAIN_HEADER) data = { title: inputs.mainHeader };
    if (type === ELEMENT_TYPES.HEADER_IMAGE) data = { url: inputs.headerImage };
    if (type === ELEMENT_TYPES.SECTION) data = { title: inputs.sectionTitle };
    if (type === ELEMENT_TYPES.MAIN_BODY_COPY) data = { copy: inputs.mainBodyCopy };
    if (type === ELEMENT_TYPES.BODY_IMAGE) data = { url: inputs.bodyImage, title: inputs.bodyCopyTitle, copy: inputs.bodyCopy };
    if (type === ELEMENT_TYPES.YOUTUBE_VIDEO) data = { url: inputs.youtubeUrl };
    if (type === ELEMENT_TYPES.ACCORDION) data = { title: inputs.accordionTitle, copy: inputs.accordionCopy };
    if (type === ELEMENT_TYPES.WIDGET_BLOCK) data = { field: inputs.widgetField };
    setElements([...elements, { id: generateId(), type, data }]);
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
  };

  const handleEditStart = (id: string, value: string) => {
    setEditingId(id);
    setEditingValue(value);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditingValue(e.target.value);
  };

  const handleEditSave = (id: string, field: string) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, data: { ...el.data, [field]: editingValue } } : el
    ));
    setEditingId(null);
    setEditingValue('');
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string, field: string) => {
    if (e.key === 'Enter') {
      handleEditSave(id, field);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => {
      const isOpen = !!prev[id];
      // Close all, then open the clicked one if it was closed
      return isOpen ? {} : { [id]: true };
    });
  };

  const renderElement = (el: any) => {
    switch (el.type) {
      case ELEMENT_TYPES.MAIN_HEADER:
        return editingId === el.id ? (
          <input
            className="_main-header editing"
            value={editingValue}
            autoFocus
            onChange={handleEditChange}
            onBlur={() => handleEditSave(el.id, 'title')}
            onKeyDown={e => handleEditKeyDown(e, el.id, 'title')}
          />
        ) : (
          <h1
            className="_main-header"
            key={el.id}
            onClick={() => handleEditStart(el.id, el.data.title)}
            style={{ cursor: 'pointer' }}
          >
            {el.data.title}
          </h1>
        );
      case ELEMENT_TYPES.HEADER_IMAGE:
        return <img className="_header-image" key={el.id} src={el.data.url} alt="Header" />;
      case ELEMENT_TYPES.SECTION:
        return (
          <div key={el.id}>
            {editingId === el.id ? (
              <input
                className="_section-title editing"
                value={editingValue}
                autoFocus
                onChange={handleEditChange}
                onBlur={() => handleEditSave(el.id, 'title')}
                onKeyDown={e => handleEditKeyDown(e, el.id, 'title')}
              />
            ) : (
              <h2
                className="_section-title"
                onClick={() => handleEditStart(el.id, el.data.title)}
                style={{ cursor: 'pointer' }}
              >
                {el.data.title}
              </h2>
            )}
          </div>
        );
      case ELEMENT_TYPES.MAIN_BODY_COPY:
        return editingId === el.id ? (
          <textarea
            className="_main-body-copy editing"
            value={editingValue}
            autoFocus
            onChange={handleEditChange}
            onBlur={() => handleEditSave(el.id, 'copy')}
            onKeyDown={e => handleEditKeyDown(e, el.id, 'copy')}
          />
        ) : (
          <p
            className="_main-body-copy"
            key={el.id}
            onClick={() => handleEditStart(el.id, el.data.copy)}
            style={{ cursor: 'pointer' }}
          >
            {el.data.copy}
          </p>
        );
      case ELEMENT_TYPES.BODY_IMAGE:
        return (
          <div className="_body-image-block" key={el.id}>
            <img className="_body-image" src={el.data.url} alt="Body" />
            <div className="_body-copy-container">
              {el.data.title && <h3 className="_body-copy-title">{el.data.title}</h3>}
              {editingId === el.id ? (
                <textarea
                  className="_body-copy editing"
                  value={editingValue}
                  autoFocus
                  onChange={handleEditChange}
                  onBlur={() => handleEditSave(el.id, 'copy')}
                  onKeyDown={e => handleEditKeyDown(e, el.id, 'copy')}
                />
              ) : (
                <div
                  className="_body-copy"
                  onClick={() => handleEditStart(el.id, el.data.copy)}
                  style={{ cursor: 'pointer' }}
                >
                  {el.data.copy}
                </div>
              )}
            </div>
          </div>
        );
      case ELEMENT_TYPES.YOUTUBE_VIDEO:
        // Extract video ID from URL
        const match = el.data.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/);
        const videoId = match ? match[1] : null;
        return videoId ? (
          <div className="_youtube-video" key={el.id}>
            <iframe
              width="100%"
              height="382"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ maxWidth: '680px', width: '100%' }}
            ></iframe>
          </div>
        ) : null;
      case ELEMENT_TYPES.ACCORDION:
        return (
          <div className="_accordion" key={el.id}>
            <div className="_accordion-header" onClick={() => toggleAccordion(el.id)}>
              <span className="_accordion-title">{el.data.title}</span>
              <button className={"_accordion-toggle" + (openAccordions[el.id] ? " _accordion-toggle--active" : "")} aria-label={openAccordions[el.id] ? 'Collapse' : 'Expand'}>
                {openAccordions[el.id] ? '-' : '+'}
              </button>
            </div>
            {openAccordions[el.id] && (
              <div className="_accordion-body">
                <div className="_accordion-copy">{el.data.copy}</div>
              </div>
            )}
          </div>
        );
      case ELEMENT_TYPES.WIDGET_BLOCK:
        return (
          <div style={{maxWidth: '1000px', width: '100%', margin: '0 auto 64px', display: 'flex'}} key={el.id}>
            <div id="Trending_Products" className="_tabcontent _widget_item_section">
              {'{{WidgetTemplate=PB-Homepage-Widget,' + el.data.field + '}}'}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPreview = () => (
    <div className="template-preview">
      {elements.map(el => renderElement(el))}
    </div>
  );

  // HTML/CSS/JS export
  const generateExport = () => {
    const html = elements.map(el => {
      switch (el.type) {
        case ELEMENT_TYPES.MAIN_HEADER:
          return `<h1 class="_main-header">${el.data.title}</h1>`;
        case ELEMENT_TYPES.HEADER_IMAGE:
          return `<img class="_header-image" src="${el.data.url}" alt="Header" />`;
        case ELEMENT_TYPES.SECTION:
          return `<h2 class="_section-title">${el.data.title}</h2>`;
        case ELEMENT_TYPES.MAIN_BODY_COPY:
          return `<p class="_main-body-copy">${el.data.copy}</p>`;
        case ELEMENT_TYPES.BODY_IMAGE:
          return `<div class="_body-image-block"><img class="_body-image" src="${el.data.url}" alt="Body" /><div class="_body-copy-container">${el.data.title ? `<h3 class="_body-copy-title">${el.data.title}</h3>` : ''}<div class="_body-copy">${el.data.copy}</div></div></div>`;
        case ELEMENT_TYPES.YOUTUBE_VIDEO:
          // Export as responsive iframe
          const match = el.data.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/);
          const videoId = match ? match[1] : null;
          return videoId ? `<div class="_youtube-video"><iframe width="100%" height="382" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="max-width:680px;width:100%"></iframe></div>` : '';
        case ELEMENT_TYPES.ACCORDION:
          return `<div class="_accordion"><div class="_accordion-header"><span class="_accordion-title">${el.data.title}</span><button class="_accordion-toggle" aria-label="Expand/Collapse">+</button></div><div class="_accordion-body" style="display:none;"><div class="_accordion-copy">${el.data.copy}</div></div></div>`;
        case ELEMENT_TYPES.WIDGET_BLOCK:
          return `<div style="max-width: 1000px !important; width: 100% !important; margin: 0 auto 64px !important; display: flex ;"><div id="Trending_Products" class="_tabcontent _widget_item_section">{{WidgetTemplate=PB-Homepage-Widget,${el.data.field}}}</div></div>`;
        default:
          return '';
      }
    }).join('\n');
    const css = `
._template-builder-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
}

._template-builder-form {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 2rem;
  min-width: 320px;
  max-width: 350px;
  flex: 1 1 320px;
}

._template-builder-form h2 {
  margin-bottom: 1.5rem;
}

._form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

._form-group input,
._form-group textarea {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

._form-group button {
  align-self: flex-end;
  padding: 0.4rem 1.2rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

._form-group button:hover {
  background: #0056b3;
}

._elements-list {
  margin: 1.5rem 0;
}

._element-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

._element-row button {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.2rem 0.8rem;
  cursor: pointer;
  font-size: 0.95rem;
}

._export-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
}

._copied-msg {
  color: #28a745;
  font-size: 0.95rem;
  margin-left: 0.5rem;
}

._template-builder-preview {
  background: #fafbfc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2rem 1rem;
  min-width: 320px;
  max-width: 1000px;
  flex: 2 1 350px;
}

._template-builder-preview h3 {
  margin-bottom: 1.5rem;
}

._template-preview {
  width: 100%;
}

._main-header {
  font-size: 2.5rem;
  text-align: center;
  margin: 1rem 0;
  text-transform: uppercase;
  font-family: 'tungsten', sans-serif; 
}

._header-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}

._main-body-copy {
  max-width: 680px;
  width: 100%;
  margin: 0 auto 32px !important;
}

._section-title {
  font-family: 'tungsten', sans-serif; 
  font-size: 2.5rem !important;
  margin: 2.5rem auto 1rem auto !important;
  text-align: center;
  max-width: 680px;
  width: 100%;
} 

._body-copy-title {
  font-size: 1.75rem !important;
  font-family: 'tungsten', sans-serif;
}

._body-copy-container{
  flex: 1 1 0%;
}

._body-image-block {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 1.5rem auto 32px;
  max-width: 680px;
  width: 100%;
}

._body-image {
  width: 200px;
  max-width: 100%;
  margin-right: 1rem;
}

._body-copy {
  flex: 1;
  min-width: 150px;
}

._youtube-video {
  max-width: 680px;
  width: 100%;
  margin: 16px auto;
  display: flex;
  justify-content: center;
}

._accordion {
  max-width: 680px;
  margin: 0px auto;

font-size: 1rem;
        width: 100%;
        border: none;
        border-radius: 0em !important;
        text-align: left !important;
        outline: none;
        transition: 0.4s;
        height: auto !important;
        min-height: 50px;
        border-top: 1px solid #f1f1f1;
        line-height: 28px;

}
._accordion-header {
  font-size: 1.5rem;
  letter-spacing: .05rem;
  color: #000 !important;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem 1.5rem 1.5rem;
  cursor: pointer;
  background: #fafafa;
  transition: background 0.4s;
  border: none;
  outline: none;

}
._accordion-header:hover, ._accordion-header:focus {
      background-color: #f9f9f9 !important;
}
._accordion-title {
  font-size: 1.75rem;
  font-family: 'tungsten', sans-serif;
  font-weight: 600;
  letter-spacing: 0.01em;
  flex: 1;
  user-select: none;
}
._accordion-toggle {
        color: #777;
        border: 1px solid #777;
        font-weight: bold;
        float: right;
        margin-left: 5px;
        border-radius: 50%;
        transition: all 0.3s ease;
        height: 32px;
        width: 32px;
        background: #f2f2f2;
}

._accordion-toggle:active {
  background: #E04F26;
  color: #fff;
  border: 1px solid #E04F26;
}

._accordion-toggle:hover {
  color: #d3d3d3;
  border: 1px solid #d3d3d3;

}
._accordion-body {
  padding: 2rem 2rem 2rem 2rem;
  background: #fff;
  animation: accordion-fade-in 0.3s;
  transition: max-height 0.6s cubic-bezier(0.4,0,0.2,1), padding 0.6s;
}
@keyframes accordion-fade-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
._accordion-copy {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  color: #222;
}

._accordion-toggle--active {
  background: #E04F26;
  color: #fff;
  border: 1px solid #E04F26;
}

@media (max-width: 900px) {
  ._template-builder-container {
    flex-direction: column;
    align-items: stretch;
  }
  ._template-builder-form, ._template-builder-preview {
    max-width: 100%;
    min-width: 0;
  }
}

@media (max-width: 600px) {
  ._body-image-block {
    flex-direction: column;
    align-items: flex-start;
  }
  ._body-image {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100%;
  }
  ._accordion-header {
    font-size: 1.2rem;
    padding: 1rem 1rem 1rem 1rem;
    min-height: 48px;
  }
  ._accordion-title {
    font-size: 1.2rem;
  }
  ._accordion-toggle {
    width: 32px;
    height: 32px;
    font-size: 1.2rem;
  }
  ._accordion-body {
    padding: 1rem 1rem 1rem 1rem;
  }
} 

a._view_all_arrow {
    float: right;
    text-decoration: none;
}

a._view_all_arrow:hover {
    text-decoration: underline;
    color: #E04F26;
}

._view_all_arrow:after {
    vertical-align: middle;
    display: inline-block;
    font: normal normal normal 30px / 1 "Font Awesome 6 Pro";
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\f105";
    font-weight: 900;
    margin-left: 6px;
    font-size: 1.2rem;
    padding-bottom: 2px;
}

._recommended-accessory-marketing-label {
    width: 220px;
    height: auto;
    max-height: 290px;
    position: relative;
    margin: 9px 16px 0 0;
    outline-offset: -2px;
    overflow: hidden;
}

._recommended-accessory-marketing-label:hover {
    box-shadow: 6px 6px 6px 2px #0c0b082e;
    transform: translateY(-.1rem);
    transition: .3s;
}

._recommended-accessory-marketing-label:hover ._shop_now_cta {
    color: #E04F26;
}

._recommended-accessory-marketing-label img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

._recommended-accessory-marketing-label section {
    position: absolute;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    padding: 16px 0 0;
}

._recommended-accessory-marketing-label p {
    font-family: 'UniversLTStd-Cn', sans-serif;
    color: #fff;
    padding: 8px;
    margin: 0 !important;
    text-shadow: 0 0 8px #000000c4;
    font-size: 0.9rem !important;
    text-align: left;
    letter-spacing: 0.5px;
}

._recommended-accessory-marketing-label ._shop_now_cta {
    font-family: 'UniversLTStd-Cn', sans-serif;
    color: #fff;
    margin: 0 auto 8px 0;
    text-shadow: 0 0 8px #000000c4;
    font-size: 1rem;
    width: 100%;
    text-align: center;
    position: relative;
}

._recommended-accessory-marketing-label ._shop_now_cta:after {
    vertical-align: middle;
    display: inline-block;
    font: normal normal normal 30px / 1 "Font Awesome 6 Pro";
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\f105";
    font-weight: 900;
    margin-left: 6px;
    font-size: 1.2rem;
    padding-bottom: 2px;
}

.recommended-accessory-marketing {
    background-color: #fff;
}

.recommended-accessory-marketing:hover {
    background: transparent linear-gradient(180deg, #46464700 0%, #4746461c 100%) 0% 0% no-repeat padding-box;
    mix-blend-mode: multiply;
}

.recommended-accessory-marketing-copy {
    mix-blend-mode: multiply;
}

.recommended-accessory-marketing-copy:hover {
    background-color: #f2f2f2;
} 
`;
    const js = `
(function() {
  var toggles = document.querySelectorAll('._accordion-toggle');
  toggles.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var accordion = btn.closest('._accordion');
      var body = accordion.querySelector('._accordion-body');
      var allAccordions = document.querySelectorAll('._accordion');
      allAccordions.forEach(function(acc) {
        var accBody = acc.querySelector('._accordion-body');
        var accBtn = acc.querySelector('._accordion-toggle');
        if (acc !== accordion) {
          accBody.style.display = 'none';
          accBtn.textContent = '+';
          accBtn.classList.remove('_accordion-toggle--active');
        }
      });
      if (body.style.display === 'block') {
        body.style.display = 'none';
        btn.textContent = '+';
        btn.classList.remove('_accordion-toggle--active');
      } else {
        body.style.display = 'block';
        btn.textContent = '-';
        btn.classList.add('_accordion-toggle--active');
      }
    });
  });
})();
`;
    return { html, css, js };
  };

  const handleCopyAll = () => {
    const { html, css, js } = generateExport();
    const allCode = `<style>\n${css}\n</style>\n\n${html}\n\n<script>\n${js}\n</script>`;
    navigator.clipboard.writeText(allCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="_template-builder-container">
      <div className="_template-builder-form">
        <h2>Template Builder</h2>
        <div className="_form-group">
          <input name="mainHeader" value={inputs.mainHeader} onChange={handleInput} placeholder="Main Header Title" />
          <button onClick={() => addElement(ELEMENT_TYPES.MAIN_HEADER)}>Add Main Header</button>
        </div>
        <div className="_form-group">
          <input name="headerImage" value={inputs.headerImage} onChange={handleInput} placeholder="Header Image URL" />
          <button onClick={() => addElement(ELEMENT_TYPES.HEADER_IMAGE)}>Add Header Image</button>
        </div>
        <div className="_form-group">
          <input name="sectionTitle" value={inputs.sectionTitle} onChange={handleInput} placeholder="Section Title" />
          <button onClick={() => addElement(ELEMENT_TYPES.SECTION)}>Add Section Title</button>
        </div>
        <div className="_form-group">
          <input name="mainBodyCopy" value={inputs.mainBodyCopy} onChange={handleInput} placeholder="Main Body Copy" />
          <button onClick={() => addElement(ELEMENT_TYPES.MAIN_BODY_COPY)}>Add Main Body Copy</button>
        </div>
        <div className="_form-group">
          <input name="bodyImage" value={inputs.bodyImage} onChange={handleInput} placeholder="Body Image URL" />
          <input name="bodyCopyTitle" value={inputs.bodyCopyTitle} onChange={handleInput} placeholder="Body Copy Title" />
          <textarea name="bodyCopy" value={inputs.bodyCopy} onChange={handleInput} placeholder="Body Copy" />
          <button onClick={() => addElement(ELEMENT_TYPES.BODY_IMAGE)}>Body Section</button>
        </div>
        <div className="_form-group">
          <label htmlFor="youtubeUrl">YouTube Video URL</label>
          <input
            type="text"
            id="youtubeUrl"
            name="youtubeUrl"
            value={inputs.youtubeUrl}
            onChange={handleInput}
            placeholder="Paste YouTube video URL"
          />
          <button type="button" onClick={() => addElement(ELEMENT_TYPES.YOUTUBE_VIDEO)}>
            Add YouTube Video
          </button>
        </div>
        <div className="_form-group">
          <input name="accordionTitle" value={inputs.accordionTitle} onChange={handleInput} placeholder="Accordion Title" />
          <textarea name="accordionCopy" value={inputs.accordionCopy} onChange={handleInput} placeholder="Accordion Copy" />
          <button onClick={() => addElement(ELEMENT_TYPES.ACCORDION)}>Add Accordion</button>
        </div>
        <div className="_form-group">
          <input name="widgetField" value={inputs.widgetField} onChange={handleInput} placeholder="Widget Field Value" />
          <button onClick={() => addElement(ELEMENT_TYPES.WIDGET_BLOCK)}>Add Widget Block</button>
        </div>
        <div className="_elements-list">
          {elements.map(el => (
            <div className="_element-row" key={el.id}>
              <span>{el.type === ELEMENT_TYPES.BODY_IMAGE ? 'body section' : el.type.replace('_', '').replace('-', ' ')}</span>
              <button onClick={() => removeElement(el.id)}>Remove</button>
            </div>
          ))}
        </div>
        <div className="_export-buttons">
          <button onClick={handleCopyAll}>Copy All Code</button>
          {copied && <span className="_copied-msg">Copied!</span>}
        </div>
      </div>
      <div className="_template-builder-preview">
        <h3>Preview</h3>
        {renderPreview()}
      </div>
    </div>
  );
};

export default TemplateBuilder; 
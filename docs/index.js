/* global React */
/* global ReactQuill */
'use strict';

if (typeof React !== 'object') {
  alert('React not found. Did you run "npm install"?');
}

if (typeof ReactQuill !== 'function') {
  alert('ReactQuill not found. Did you run "make build"?');
}

var EMPTY_DELTA = { ops: [] };

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: 'snow',
      enabled: true,
      readOnly: false,
      value: '',
      textareaValue: '',
      events: [],
      copySuccess: '',
    };
    this.textareaRef = React.createRef();
  }

  formatRange(range) {
    return range ? [range.index, range.index + range.length].join(',') : 'none';
  }

  onEditorChange = (value, delta, source, editor) => {
    this.setState({
      // value:  editor.getContents(),
      value: value,
      textareaValue: value,
      // events: [`[${source}] text-change`, ...this.state.events],
    });
  };

  onEditorChangeSelection = (range, source) => {
    this.setState({
      selection: range,
      // events: [
      //   `[${source}] selection-change(${this.formatRange(this.state.selection)} -> ${this.formatRange(range)})`,
      //   ...this.state.events,
      // ]
    });
  };

  onEditorFocus = (range, source) => {
    this.setState({
      events: [`[${source}] focus(${this.formatRange(range)})`].concat(
        this.state.events
      ),
    });
  };

  onEditorBlur = (previousRange, source) => {
    this.setState({
      events: [`[${source}] blur(${this.formatRange(previousRange)})`].concat(
        this.state.events
      ),
    });
  };

  onToggle = () => {
    this.setState({ enabled: !this.state.enabled });
  };

  onToggleReadOnly = () => {
    this.setState({ readOnly: !this.state.readOnly });
  };

  onSetContents = () => {
    this.setState({ value: 'This is some <b>fine</b> example content' });
  };

  render() {
    return (
      <div
        style={{
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
        }}
      >
        {/* {this.renderToolbar()} */}
        {/* <hr/> */}
        <div style={{ width: '70%', height: '100%' }}>
          {this.state.enabled && (
            <ReactQuill
              theme={this.state.theme}
              value={this.state.value}
              readOnly={this.state.readOnly}
              onChange={this.onEditorChange}
              onChangeSelection={this.onEditorChangeSelection}
            />
          )}
        </div>
        {this.renderSidebar()}
      </div>
    );
  }

  renderToolbar() {
    var state = this.state;
    var enabled = state.enabled;
    var readOnly = state.readOnly;
    var selection = this.formatRange(state.selection);
    return (
      <div>
        <button onClick={this.onToggle}>
          {enabled ? 'Disable' : 'Enable'}
        </button>
        <button onClick={this.onToggleReadOnly}>
          Set {readOnly ? 'read/Write' : 'read-only'}
        </button>
        <button onClick={this.onSetContents}>
          Fill contents programmatically
        </button>
        <button disabled={true}>Selection: ({selection})</button>
      </div>
    );
  }

  handleCopy() {
    if (this.textareaRef.current) {
      const textToCopy = this.textareaRef.current.value;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          this.setState({ copySuccess: 'Copied to clipboard!' });
          setTimeout(() => {
            this.setState({ copySuccess: '' });
          }, 3000);
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
          this.setState({ copySuccess: 'Failed to copy text.' });
          setTimeout(() => {
            this.setState({ copySuccess: '' });
          }, 3000);
        });
    }
  }

  renderSidebar() {
    return (
      <div style={{ overflow: 'hidden', width: '30%' }}>
        <textarea
          ref={this.textareaRef}
          style={{
            display: 'block',
            width: '100%',
            height: '50%',
            padding: '10px',
            border: '1px solid #ccc',
            resize: 'none',
          }}
          value={this.state.textareaValue}
          onChange={(e) => this.setState({ textareaValue: e.target.value })}
        />
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
          }}
        >
          <button
            style={{}}
            onClick={() =>
              this.setState({ value: this.textareaRef.current.value })
            }
          >
            Update
          </button>
          <button style={{}} onClick={() => this.handleCopy()}>
            Copy
          </button>
        </div>
        {this.state.copySuccess ? (
          <div style={{ marginTop: '5px' }}>
            <span style={{ color: 'green', fontSize: '12px' }}>
              {this.state.copySuccess}
            </span>
          </div>
        ) : null}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
  <React.StrictMode>
    <Editor />
  </React.StrictMode>
);

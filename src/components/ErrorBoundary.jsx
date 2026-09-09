import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          margin: '2rem',
          background: '#272B40',
          border: '1px solid #ACBAC4',
          borderRadius: '8px',
          color: '#F0F0DB'
        }}>
          <h2 style={{ color: '#F87171', marginBottom: '1rem' }}>Something went wrong rendering this component</h2>
          <pre style={{ background: '#1E2235', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.85rem' }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#E1D9BC',
              color: '#30364F',
              fontWeight: '700',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

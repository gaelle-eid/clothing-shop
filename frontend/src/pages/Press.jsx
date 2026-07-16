function Press() {
  return (
    <div className="page-container">
      <h1>Press</h1>
      <p className="subtitle">Media inquiries and press resources.</p>

      <div className="info-grid">
        <div className="info-card">
          <div className="icon">📰</div>
          <h3>Media Kit</h3>
          <p>Download our press kit with high-res images and brand assets.</p>
        </div>
        <div className="info-card">
          <div className="icon">📝</div>
          <h3>Press Releases</h3>
          <p>Read our latest announcements and company news.</p>
        </div>
        <div className="info-card">
          <div className="icon">📧</div>
          <h3>Contact Press Team</h3>
          <p>For media inquiries, email us at press@amber.com</p>
        </div>
      </div>
    </div>
  );
}
export default Press;
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="footer-mark" href="#top">Confession for u!</a>

      <p>Made with 🧡 by {import.meta.env.VITE_LETTER_AUTHOR}</p>
      <p>Your {import.meta.env.VITE_LETTER_AUTHOR} © 2026</p>
    </footer>
  )
}

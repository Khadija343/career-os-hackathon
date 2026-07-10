function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/40 py-6 text-center text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 CareerOS. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
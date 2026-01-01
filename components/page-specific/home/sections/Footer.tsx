export function Footer() {
  return (
    <footer className="w-full border-t border-(--border-subtle) bg-(--surface) py-10 mt-24 text-(--text-secondary)">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-(--brand)">InventoryApp</span>
          <span className="opacity-60">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#features" className="hover:text-(--brand) transition">
            Features
          </a>
          <a href="#preview" className="hover:text-(--brand) transition">
            Preview
          </a>
          <a href="/inventory" className="hover:text-(--brand) transition">
            Dashboard
          </a>
          <a
            href="mailto:support@inventoryapp.com"
            className="hover:text-(--brand) transition"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

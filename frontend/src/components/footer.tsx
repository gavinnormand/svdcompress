function Footer() {
  return (
    <footer>
      <div className="bg-[#304674] flex items-center justify-between px-12 py-4 text-white">
        <p>© {new Date().getFullYear()} Gavin Normand</p>
        <p>
          <a
            href="https://www.gavinnormand.com/"
            className="hover:text-[#c6d3e3] active:text-[#c6d3e3] flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.gavinnormand.com
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;

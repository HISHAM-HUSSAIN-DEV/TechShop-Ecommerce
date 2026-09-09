import React from "react";
import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Company */}
          <div>
            <h2 className="mb-4 text-lg font-bold tracking-wide text-white">
              COMPANY
            </h2>

            <ul className="space-y-3 text-sm">
              <li className="text-slate-400">
                About
              </li>

              <li className="text-slate-400">
                Careers
              </li>

              <li className="text-slate-400">
                Brand Center
              </li>

              <li className="text-slate-400">
                Blog
              </li>
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h2 className="mb-4 text-lg font-bold tracking-wide text-white">
              HELP CENTER
            </h2>

            <ul className="space-y-3 text-sm">
              <li className="text-slate-400">
                Discord Server
              </li>

              <li className="text-slate-400">
                Twitter
              </li>

              <li className="text-slate-400">
                Facebook
              </li>

              <li className="text-slate-400">
                Contact Us
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="mb-4 text-lg font-bold tracking-wide text-white">
              LEGAL
            </h2>

            <ul className="space-y-3 text-sm">
              <li className="text-slate-400">
                Privacy Policy
              </li>

              <li className="text-slate-400">
                Licensing
              </li>

              <li className="text-slate-400">
                Terms & Conditions
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-slate-700 pt-6 md:flex-row">
          <span className="text-sm text-slate-400">
            © 2026{" "}
            <span className="font-semibold text-blue-400">
              TechShop™
            </span>
            . All Rights Reserved.
          </span>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/HISHAM-HUSSAIN-DEV/TechShop-Ecommerce"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-blue-500 hover:bg-slate-800 hover:text-blue-400"
            >
              <FaGithub className="h-5 w-5" />
            </a>

            <a
              href="https://www.linkedin.com/in/hesham-alsaedi-6ab1a1406"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-blue-500 hover:bg-slate-800 hover:text-blue-400"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
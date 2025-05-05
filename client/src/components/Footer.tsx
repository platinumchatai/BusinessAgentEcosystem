const Footer = () => {
  return (
    <footer className="bg-neutral-400 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">
              Platinum Chat AI Business Builder
            </h3>
            <p className="text-white/80 text-sm">
              Your AI-powered business growth partner from ideation to scaling
              beyond $10M.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">
              Agent Categories
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="/#agents" className="hover:text-white">
                  Strategy Agents
                </a>
              </li>
              <li>
                <a href="/#agents" className="hover:text-white">
                  Marketing Agents
                </a>
              </li>
              <li>
                <a href="/#agents" className="hover:text-white">
                  Finance Agents
                </a>
              </li>
              <li>
                <a href="/#agents" className="hover:text-white">
                  Product Agents
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Business Phases</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="/#workflows" className="hover:text-white">
                  Ideation & Planning
                </a>
              </li>
              <li>
                <a href="/#workflows" className="hover:text-white">
                  Launch & Establish
                </a>
              </li>
              <li>
                <a href="/#workflows" className="hover:text-white">
                  Growth & Optimization
                </a>
              </li>
              <li>
                <a href="/#workflows" className="hover:text-white">
                  Scaling Beyond $10M
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
            <p className="text-sm text-white/80 mb-4">
              Have questions about our AI agents? Reach out to our team.
            </p>
            <a
              href="#chat"
              className="inline-block bg-white text-primary font-semibold px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
          <p>
            &copy; {new Date().getFullYear()} Platinum Chat AI Business Builder
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Calendar, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AppointHQ
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Smart appointment booking platform for modern businesses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AppointHQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

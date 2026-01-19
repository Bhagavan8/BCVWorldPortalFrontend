import React from 'react';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <p className="mb-0">© 2026 Jobs Admin. All rights reserved.</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <ul className="list-inline mb-0">
                            <li className="list-inline-item"><a href="#">Help</a></li>
                            <li className="list-inline-item"><a href="/privacy">Privacy</a></li>
                            <li className="list-inline-item"><a href="/terms">Terms</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

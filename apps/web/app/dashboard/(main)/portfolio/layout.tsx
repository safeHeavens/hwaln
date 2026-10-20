
import PortfolioNavigation from '@/components/portfolio/PortfolioNavigation';

export default function PortfolioLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <section className="home-content">

            <PortfolioNavigation />

            <div className="portfolio-page-content">
                {children}

            </div>
        </section>
    );
}

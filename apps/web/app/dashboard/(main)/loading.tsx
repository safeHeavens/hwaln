
export default function DashboardLoading() {
    return (
        <div className="hw-loading" aria-label="Loading page" role="status">
            <div className="hw-loading-header">
                <div className="hw-skeleton hw-title-skeleton" />
                <div className="hw-skeleton hw-subtitle-skeleton" />
            </div>

            <div className="hw-loading-stats">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div className="hw-skeleton-card" key={index}>
                        <div className="hw-skeleton hw-label-skeleton" />
                        <div className="hw-skeleton hw-value-skeleton" />
                        <div className="hw-skeleton hw-line-skeleton" />
                    </div>
                ))}
            </div>

            <div className="hw-skeleton-card hw-loading-chart">
                <div className="hw-skeleton hw-label-skeleton" />
                <div className="hw-skeleton hw-chart-skeleton" />
            </div>

            <span className="sr-only">Loading your dashboard content…</span>
        </div>
    );
}
